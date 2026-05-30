CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Course" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "image" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "fullDescription" TEXT,
  "previewImage" TEXT,
  "instructor" TEXT,
  "instructorImage" TEXT,
  "tagsJson" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "students" INTEGER NOT NULL,
  "level" TEXT NOT NULL,
  "rating" REAL NOT NULL,
  "reviews" INTEGER NOT NULL,
  "price" TEXT,
  "includesJson" TEXT,
  "curriculumJson" TEXT
);

CREATE TABLE IF NOT EXISTS "Lesson" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "sections" INTEGER NOT NULL,
  CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "UserPreference" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "goal" TEXT NOT NULL,
  "interestsJson" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "consent" BOOLEAN NOT NULL DEFAULT false,
  "onboarded" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserPreference_userId_key" ON "UserPreference"("userId");

CREATE TABLE IF NOT EXISTS "UserInteraction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT,
  "courseId" TEXT,
  "type" TEXT NOT NULL,
  "metadataJson" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "UserInteraction_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Enrollment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'enrolled',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

CREATE TABLE IF NOT EXISTS "Progress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "percent" INTEGER NOT NULL DEFAULT 0,
  "lastAccessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Progress_userId_courseId_key" ON "Progress"("userId", "courseId");
