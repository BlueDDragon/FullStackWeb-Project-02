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
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("bookmark", "content", "createdAt", "id", "like", "parentPostId", "rootPostId", "state", "updatedAt", "userId") SELECT "bookmark", "content", "createdAt", "id", "like", "parentPostId", "rootPostId", "state", "updatedAt", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
