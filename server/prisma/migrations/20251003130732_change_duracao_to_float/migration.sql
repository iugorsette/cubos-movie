/*
  Warnings:

  - The `duracao` column on the `Filme` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Filme" DROP COLUMN "duracao",
ADD COLUMN     "duracao" DOUBLE PRECISION;
