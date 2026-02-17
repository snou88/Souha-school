/**
 * Prisma Seed Script
 * Creates initial data for development and testing
 * Run: pnpm db:seed
 */

import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (be careful in production!)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Clearing existing data...')
    await prisma.studentDocument.deleteMany({})
    await prisma.inscription.deleteMany({})
    await prisma.student.deleteMany({})
    await prisma.formation.deleteMany({})
    await prisma.partner.deleteMany({})
    await prisma.contactMessage.deleteMany({})
    await prisma.admin.deleteMany({})
  }

  // Create admin users
  console.log('👨‍💼 Creating admin users...')
  const adminPassword = await hashPassword('admin123')
  
  const admin1 = await prisma.admin.create({
    data: {
      name: 'Ahmed Senouci',
      email: 'admin@apexacademy.com',
      password: adminPassword,
    },
  })

  const admin2 = await prisma.admin.create({
    data: {
      name: 'Karim Ali',
      email: 'karim@apexacademy.com',
      password: adminPassword,
    },
  })

  console.log('✅ Created admins:', admin1.email, admin2.email)

  // Create formations
  console.log('📚 Creating formations...')
  const formations = await Promise.all([
    prisma.formation.create({
      data: {
        name: 'Full-Stack Web Development',
        description: 'Master modern web technologies including React, Node.js, and cloud deployment.',
        category: 'Development',
        duration: '6 months',
        status: 'Active',
      },
    }),
    prisma.formation.create({
      data: {
        name: 'Data Science & Analytics',
        description: 'Learn Python, statistics, ML algorithms, and deep learning frameworks.',
        category: 'Data',
        duration: '8 months',
        status: 'Active',
      },
    }),
    prisma.formation.create({
      data: {
        name: 'UX/UI Design Mastery',
        description: 'Design thinking, Figma, prototyping, and user research methodologies.',
        category: 'Design',
        duration: '4 months',
        status: 'Active',
      },
    }),
    prisma.formation.create({
      data: {
        name: 'Cloud & DevOps Engineering',
        description: 'AWS, Docker, Kubernetes, CI/CD pipelines, and infrastructure as code.',
        category: 'Infrastructure',
        duration: '6 months',
        status: 'Active',
      },
    }),
  ])

  console.log('✅ Created formations:', formations.map(f => f.name).join(', '))

  // Create students
  console.log('👥 Creating students...')
  const students = await Promise.all([
    prisma.student.create({
      data: {
        type: 'Individual',
        firstName: 'Sarah',
        lastName: 'Martinez',
        email: 'sarah.m@email.com',
        phone: '+1 (555) 012-3456',
        dateOfBirth: new Date('1998-05-15'),
        formationId: formations[0].id,
        status: 'Active',
      },
    }),
    prisma.student.create({
      data: {
        type: 'Company',
        companyName: 'TechCorp Solutions',
        companyStudentCount: 8,
        email: 'contact@techcorp.com',
        phone: '+1 (555) 023-4567',
        formationId: formations[1].id,
        status: 'Active',
      },
    }),
    prisma.student.create({
      data: {
        type: 'Individual',
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.c@email.com',
        phone: '+1 (555) 034-5678',
        formationId: formations[2].id,
        status: 'Active',
      },
    }),
  ])

  console.log('✅ Created students:', students.map(s => s.email).join(', '))

  // Create inscriptions
  console.log('📝 Creating inscriptions...')
  const inscriptions = await Promise.all([
    prisma.inscription.create({
      data: {
        studentId: students[0].id,
        formationId: formations[0].id,
        type: 'Individual',
        requestorName: 'Sarah Martinez',
        requestorEmail: 'sarah.m@email.com',
        requestorPhone: '+1 (555) 012-3456',
        startDate: new Date('2026-03-01'),
        numberOfStudents: 1,
        status: 'Approved',
      },
    }),
    prisma.inscription.create({
      data: {
        studentId: students[1].id,
        formationId: formations[1].id,
        type: 'Company',
        requestorName: 'TechCorp Solutions',
        requestorEmail: 'contact@techcorp.com',
        requestorPhone: '+1 (555) 023-4567',
        startDate: new Date('2026-04-01'),
        numberOfStudents: 8,
        status: 'Pending',
      },
    }),
  ])

  console.log('✅ Created inscriptions:', inscriptions.length)

  // Create partners
  console.log('🤝 Creating partners...')
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'Acme Corp',
        website: 'https://acme.example',
        featured: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Atlas Partners',
        website: 'https://atlas.example',
        featured: false,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Bright Labs',
        website: 'https://bright.example',
        featured: true,
      },
    }),
  ])

  console.log('✅ Created partners:', partners.map(p => p.name).join(', '))

  // Create contact messages
  console.log('💬 Creating contact messages...')
  const contact = await prisma.contactMessage.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry about courses',
      message: 'I am interested in the Full-Stack Web Development course. Can I get more information?',
      status: 'Unread',
    },
  })

  console.log('✅ Created contact messages')

  console.log('✨ Seed completed successfully!')
  console.log(
    '📊 Summary:',
    `${admin1 && admin2 ? '2 admins, ' : ''}${formations.length} formations, ${students.length} students, ${inscriptions.length} inscriptions, ${partners.length} partners`
  )
}

main()
  .catch((error) => {
    console.error('❌ Seed error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
