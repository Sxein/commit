-- DropForeignKey
ALTER TABLE "Commit" DROP CONSTRAINT "Commit_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommitLog" DROP CONSTRAINT "CommitLog_commitId_fkey";

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommitLog" ADD CONSTRAINT "CommitLog_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
