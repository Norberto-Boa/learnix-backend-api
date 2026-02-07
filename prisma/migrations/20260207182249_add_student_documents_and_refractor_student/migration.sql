/*
  Warnings:

  - You are about to drop the column `documentNumber` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `documentTypeId` on the `students` table. All the data in the column will be lost.
  - Added the required column `gender` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_documentTypeId_fkey";

-- DropIndex
DROP INDEX "students_documentNumber_schoolId_key";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "documentNumber",
DROP COLUMN "documentTypeId",
ADD COLUMN     "gender" "GENDER" NOT NULL;

-- CreateTable
CREATE TABLE "Student_documents" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "fileUrl" TEXT,
    "documentTypeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_documents_documentTypeId_documentNumber_schoolId_key" ON "Student_documents"("documentTypeId", "documentNumber", "schoolId");

-- AddForeignKey
ALTER TABLE "Student_documents" ADD CONSTRAINT "Student_documents_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student_documents" ADD CONSTRAINT "Student_documents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student_documents" ADD CONSTRAINT "Student_documents_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
