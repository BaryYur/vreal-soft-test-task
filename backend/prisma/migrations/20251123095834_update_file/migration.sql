/*
  Warnings:

  - You are about to drop the column `hasAccess` on the `directory` table. All the data in the column will be lost.
  - You are about to drop the column `hasAccess` on the `file` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileAccess" AS ENUM ('change', 'watch');

-- AlterTable
ALTER TABLE "directory" DROP COLUMN "hasAccess";

-- AlterTable
ALTER TABLE "file" DROP COLUMN "hasAccess",
ADD COLUMN     "access" TEXT[],
ADD COLUMN     "s3Key" TEXT;

-- CreateTable
CREATE TABLE "UserAccess" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "access" "FileAccess" NOT NULL DEFAULT 'change',

    CONSTRAINT "UserAccess_pkey" PRIMARY KEY ("id")
);
