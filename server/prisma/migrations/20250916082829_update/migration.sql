-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "googleId" DROP NOT NULL,
ALTER COLUMN "profilePicture" SET DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';
