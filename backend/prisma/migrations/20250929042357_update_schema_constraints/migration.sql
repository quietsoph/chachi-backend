/*
  Warnings:

  - You are about to alter the column `emoji_uni_code` on the `Emoji` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to alter the column `name` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `mime_type` on the `Media` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(15)`.
  - You are about to alter the column `display_name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - A unique constraint covering the columns `[password]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Emoji" ALTER COLUMN "emoji_uni_code" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "public"."Group" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."Media" ALTER COLUMN "mime_type" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "s3_bucket_url" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "s3_key" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "thumbnail_s3_key" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."Member" ADD COLUMN     "role" VARCHAR(20) NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "display_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "avatar_url" SET DATA TYPE VARCHAR(500);

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "public"."User"("password");
