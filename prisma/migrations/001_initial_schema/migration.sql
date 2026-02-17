-- CreateEnum
CREATE TYPE "FormationStatus" AS ENUM ('Active', 'Draft', 'Archived');
CREATE TYPE "StudentType" AS ENUM ('Individual', 'Company');
CREATE TYPE "StudentStatus" AS ENUM ('Active', 'Inactive', 'Graduated');
CREATE TYPE "InscriptionStatus" AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE "ContactMessageStatus" AS ENUM ('Unread', 'Read', 'Replied');

-- CreateTable Admin
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable Formation
CREATE TABLE "Formation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable Student
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "companyName" TEXT,
    "companyStudentCount" INTEGER,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "enrolledDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Student_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable Inscription
CREATE TABLE "Inscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requestorName" TEXT NOT NULL,
    "requestorEmail" TEXT NOT NULL,
    "requestorPhone" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "numberOfStudents" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Inscription_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Inscription_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable Partner
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "website" TEXT,
    "logoUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable ContactMessage
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable StudentDocument
CREATE TABLE "StudentDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentDocument_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");
CREATE INDEX "Formation_status_idx" ON "Formation"("status");
CREATE INDEX "Formation_category_idx" ON "Formation"("category");
CREATE INDEX "Student_type_idx" ON "Student"("type");
CREATE INDEX "Student_status_idx" ON "Student"("status");
CREATE INDEX "Student_formationId_idx" ON "Student"("formationId");
CREATE INDEX "Student_email_idx" ON "Student"("email");
CREATE INDEX "Inscription_status_idx" ON "Inscription"("status");
CREATE INDEX "Inscription_studentId_idx" ON "Inscription"("studentId");
CREATE INDEX "Inscription_formationId_idx" ON "Inscription"("formationId");
CREATE UNIQUE INDEX "Student_type_email_key" ON "Student"("type", "email");
CREATE UNIQUE INDEX "StudentDocument_studentId_fileName_key" ON "StudentDocument"("studentId", "fileName");
CREATE INDEX "Partner_featured_idx" ON "Partner"("featured");
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");
CREATE INDEX "ContactMessage_email_idx" ON "ContactMessage"("email");
CREATE INDEX "StudentDocument_studentId_idx" ON "StudentDocument"("studentId");
