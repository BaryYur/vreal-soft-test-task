/*
  Warnings:

  - You are about to drop the column `access` on the `file` table. All the data in the column will be lost.
  - You are about to drop the `UserAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "file" DROP COLUMN "access";

-- DropTable
DROP TABLE "UserAccess";

-- CreateTable
CREATE TABLE "user_file_access" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "access" "FileAccess" NOT NULL DEFAULT 'change',
    "fileId" TEXT NOT NULL,

    CONSTRAINT "user_file_access_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_file_access" ADD CONSTRAINT "user_file_access_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
