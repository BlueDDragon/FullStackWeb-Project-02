-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "folderId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    PRIMARY KEY ("folderId", "postId"),
    CONSTRAINT "Bookmark_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "BookmarkFolder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("folderId", "postId") SELECT "folderId", "postId" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE TABLE "new_BookmarkFolder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BookmarkFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookmarkFolder" ("description", "id", "name", "userId") SELECT "description", "id", "name", "userId" FROM "BookmarkFolder";
DROP TABLE "BookmarkFolder";
ALTER TABLE "new_BookmarkFolder" RENAME TO "BookmarkFolder";
CREATE TABLE "new_Follow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("followerId", "followingId"),
    CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Follow" ("createdAt", "followerId", "followingId", "isFavorite", "isMuted") SELECT "createdAt", "followerId", "followingId", "isFavorite", "isMuted" FROM "Follow";
DROP TABLE "Follow";
ALTER TABLE "new_Follow" RENAME TO "Follow";
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL DEFAULT 'PUBLIC',
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "rootPostId" INTEGER,
    "parentPostId" INTEGER,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "content", "createdAt", "id", "parentPostId", "rootPostId", "state", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "parentPostId", "rootPostId", "state", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");
CREATE INDEX "Post_rootPostId_idx" ON "Post"("rootPostId");
CREATE INDEX "Post_parentPostId_idx" ON "Post"("parentPostId");
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE TABLE "new_PostImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imgUrl" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostImage" ("id", "imgUrl", "postId") SELECT "id", "imgUrl", "postId" FROM "PostImage";
DROP TABLE "PostImage";
ALTER TABLE "new_PostImage" RENAME TO "PostImage";
CREATE TABLE "new_PostLike" (
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "postId"),
    CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostLike" ("postId", "userId") SELECT "postId", "userId" FROM "PostLike";
DROP TABLE "PostLike";
ALTER TABLE "new_PostLike" RENAME TO "PostLike";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
