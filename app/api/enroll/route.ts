import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { isValidEmail, isValidPhone, sanitizeInput } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

interface EnrollmentPayload {
	accountType: 'Individual' | 'Company'
	firstName?: string
	lastName?: string
	email: string
	phone: string
	dateOfBirth?: string
	companyName?: string
	companyPhone?: string
	companyStudentCount?: string
	companyContactName?: string
	companyContactEmail?: string
	selectedProgram: string
	startDate: string
	agreeTerms: boolean
}

export async function POST(req: NextRequest) {
	try {
		const payload: EnrollmentPayload = await req.json()
		console.log('ENROLL PAYLOAD', JSON.stringify(payload, null, 2))

		// Basic required fields (program and dates)
		if (!payload.accountType || !payload.selectedProgram || !payload.startDate) {
			return NextResponse.json(
				{ success: false, message: 'Missing required fields' },
				{ status: 400, headers: corsHeaders() }
			)
		}

		// Validate contact fields depending on account type
		if (payload.accountType === 'Individual') {
			if (!payload.email || !payload.phone) {
				return NextResponse.json(
					{ success: false, message: 'Missing required contact fields for individual' },
					{ status: 400, headers: corsHeaders() }
				)
			}

			if (!isValidEmail(payload.email)) {
				return NextResponse.json(
					{ success: false, message: 'Invalid email format' },
					{ status: 400, headers: corsHeaders() }
				)
			}

			if (!isValidPhone(payload.phone)) {
				return NextResponse.json(
					{ success: false, message: 'Invalid phone format' },
					{ status: 400, headers: corsHeaders() }
				)
			}
		} else {
			// Company: accept either company contact email/phone or fallback to top-level email/phone
			const contactEmail = payload.companyContactEmail || payload.email
			const contactPhone = payload.companyPhone || payload.phone

			if (!contactEmail || !contactPhone) {
				return NextResponse.json(
					{ success: false, message: 'Missing required contact fields for company' },
					{ status: 400, headers: corsHeaders() }
				)
			}

			if (!isValidEmail(contactEmail)) {
				return NextResponse.json(
					{ success: false, message: 'Invalid contact email format' },
					{ status: 400, headers: corsHeaders() }
				)
			}

			if (!isValidPhone(contactPhone)) {
				return NextResponse.json(
					{ success: false, message: 'Invalid contact phone format' },
					{ status: 400, headers: corsHeaders() }
				)
			}
		}

		// Find formation
		const { data: formation } = await supabase
			.from('formations')
			.select('*')
			.eq('name', payload.selectedProgram)
			.single()

		if (!formation) {
			return NextResponse.json(
				{ success: false, message: 'Selected program not found' },
				{ status: 404, headers: corsHeaders() }
			)
		}

		// Determine name based on account type
		let studentName = ''
		let requestorEmail = payload.email

		if (payload.accountType === 'Individual') {
			if (!payload.firstName || !payload.lastName) {
				return NextResponse.json(
					{ success: false, message: 'First and last name required' },
					{ status: 400, headers: corsHeaders() }
				)
			}
			studentName = `${sanitizeInput(payload.firstName)} ${sanitizeInput(payload.lastName)}`
		} else {
			if (!payload.companyName || !payload.companyContactName) {
				return NextResponse.json(
					{ success: false, message: 'Company name and contact name required' },
					{ status: 400, headers: corsHeaders() }
				)
			}
			studentName = sanitizeInput(payload.companyName)
			requestorEmail = payload.companyContactEmail || payload.email

			// Validate company student count
			const studentCount = parseInt(payload.companyStudentCount || '0')
			if (isNaN(studentCount) || studentCount < 1) {
				return NextResponse.json(
					{ success: false, message: 'Invalid number of students' },
					{ status: 400, headers: corsHeaders() }
				)
			}
		}

		// Check if email already enrolled in this formation
		const { data: existingStudent } = await supabase
			.from('students')
			.select('*')
			.eq('email', payload.email.toLowerCase())
			.eq('formationId', formation.id)
			.single()

		if (existingStudent) {
			return NextResponse.json(
				{
					success: false,
					message: 'Email already enrolled in this program',
				},
				{ status: 409, headers: corsHeaders() }
			)
		}

		// Create or update student
		const { data: existingStudentData } = await supabase
			.from('students')
			.select('*')
			.eq('email', payload.email.toLowerCase())
			.single()

		let student = existingStudentData
		if (student) {
			// Update existing student
			const { data: updatedStudent } = await supabase
				.from('students')
				.update({
					formationId: formation.id,
					status: 'Active',
				})
				.eq('id', student.id)
				.select()
				.single()
			student = updatedStudent
		} else {
			// Create new student
			const { data: newStudent } = await supabase
				.from('students')
				.insert([
					{
						type: payload.accountType,
						email: payload.email.toLowerCase(),
						phone: sanitizeInput(payload.phone),
						firstName: payload.firstName ? sanitizeInput(payload.firstName) : null,
						lastName: payload.lastName ? sanitizeInput(payload.lastName) : null,
						dateOfBirth: payload.dateOfBirth ? payload.dateOfBirth : null,
						companyName: payload.companyName ? sanitizeInput(payload.companyName) : null,
						companyStudentCount: payload.companyStudentCount ? parseInt(payload.companyStudentCount) : null,
						formationId: formation.id,
						status: 'Active',
					},
				])
				.select()
				.single()
			student = newStudent
		}

		// Create inscription (enrollment request)
		const { data: inscription } = await supabase
			.from('inscriptions')
			.insert([
				{
					studentId: student.id,
					formationId: formation.id,
					type: payload.accountType,
					requestorName: studentName,
					requestorEmail: requestorEmail.toLowerCase(),
					requestorPhone: sanitizeInput(payload.phone),
					startDate: payload.startDate,
					numberOfStudents: payload.accountType === 'Company' 
						? parseInt(payload.companyStudentCount || '1') 
						: 1,
					status: 'Pending',
				},
			])
			.select()
			.single()

		// TODO: Send confirmation email to user

		return NextResponse.json(
			{
				success: true,
				message: 'Enrollment successful! We will review your application shortly.',
				data: {
					inscriptionId: inscription.id,
					studentId: student.id,
					status: inscription.status,
				},
			},
			{ status: 201, headers: corsHeaders() }
		)
	} catch (error) {
		console.error('Enrollment error:', error)
		if (error instanceof Error) {
			return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: corsHeaders() })
		}
		return handleApiError(error)
	}
}

export async function OPTIONS(req: NextRequest) {
	return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}


