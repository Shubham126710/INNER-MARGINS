/*
  Warnings:

  - You are about to drop the column `email` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `About` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `About` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_About" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "profileImage" TEXT,
    "hobbies" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_About" ("content", "id", "profileImage", "subtitle", "title", "updatedAt") SELECT "content", "id", "profileImage", "subtitle", "title", "updatedAt" FROM "About";
DROP TABLE "About";
ALTER TABLE "new_About" RENAME TO "About";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
