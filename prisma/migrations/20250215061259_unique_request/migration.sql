/*
  Warnings:

  - A unique constraint covering the columns `[userId,tocUrl,skipUntilChapter,status]` on the table `BookRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BookRequest" ADD COLUMN     "skipUntilChapter" STRING;

-- CreateIndex
CREATE UNIQUE INDEX "BookRequest_userId_tocUrl_skipUntilChapter_status_key" ON "BookRequest"("userId", "tocUrl", "skipUntilChapter", "status");
