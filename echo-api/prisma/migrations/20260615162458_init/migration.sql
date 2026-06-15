/*
  Warnings:

  - You are about to drop the column `bookmarks` on the `Post` table. All the data in the column will be lost.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rootPostId" INTEGER NOT NULL DEFAULT -1,
    "parentPostId" INTEGER NOT NULL DEFAULT -1,
    "state" TEXT NOT NULL DEFAULT 'PUBLIC',
    "content" TEXT NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "bookmark" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "createdAt", "id", "like", "parentPostId", "rootPostId", "state", "updatedAt", "userId") SELECT "content", "createdAt", "id", "like", "parentPostId", "rootPostId", "state", "updatedAt", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "password", "profileImageUrl", "updatedAt", "username") SELECT "createdAt", "email", "id", "password", "profileImageUrl", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
