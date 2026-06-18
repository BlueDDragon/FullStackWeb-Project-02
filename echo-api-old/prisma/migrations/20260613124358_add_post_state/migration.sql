-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rootPostId" INTEGER NOT NULL,
    "parentPostId" INTEGER NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'PUBLIC',
    "content" TEXT NOT NULL,
    "like" INTEGER NOT NULL,
    "bookmarks" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Post" ("bookmarks", "content", "createdAt", "id", "like", "parentPostId", "rootPostId", "updatedAt", "userId") SELECT "bookmarks", "content", "createdAt", "id", "like", "parentPostId", "rootPostId", "updatedAt", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
