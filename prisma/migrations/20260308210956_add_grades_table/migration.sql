/*
  Warnings:

  - You are about to drop the `Student_documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student_documents" DROP CONSTRAINT "Student_documents_documentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Student_documents" DROP CONSTRAINT "Student_documents_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Student_documents" DROP CONSTRAINT "Student_documents_studentId_fkey";

-- DropTable
DROP TABLE "Student_documents";

-- CreateTable
CREATE TABLE "student_documents" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "fileUrl" TEXT,
    "documentTypeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "student_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_documents_documentTypeId_documentNumber_schoolId_key" ON "student_documents"("documentTypeId", "documentNumber", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "grades_schoolId_name_key" ON "grades"("schoolId", "name");

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
