/*
  Warnings:

  - A unique constraint covering the columns `[id,schoolId]` on the table `enrollment_charges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enrollment_charges_id_schoolId_key" ON "enrollment_charges"("id", "schoolId");
