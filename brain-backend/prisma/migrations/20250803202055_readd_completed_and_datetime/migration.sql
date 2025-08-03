-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "datetime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
