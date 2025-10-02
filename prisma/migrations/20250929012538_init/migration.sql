-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "avatar_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Member" (
    "id" BIGSERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "group_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Group" (
    "id" BIGSERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" BIGSERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "group_id" BIGINT NOT NULL,
    "content" JSONB NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Emoji" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "message_id" BIGINT NOT NULL,
    "emoji_uni_code" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Emoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" BIGSERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "message_id" BIGINT NOT NULL,
    "media_name" VARCHAR(255) NOT NULL,
    "media_type" VARCHAR(200) NOT NULL,
    "media_size" INTEGER NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "s3_bucket_url" VARCHAR(255) NOT NULL,
    "s3_key" VARCHAR(255) NOT NULL,
    "thumbnail_s3_key" VARCHAR(255),
    "duration_seconds" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_public_id_key" ON "public"."User"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_public_id_key" ON "public"."Member"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Member_user_id_group_id_key" ON "public"."Member"("user_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_public_id_key" ON "public"."Group"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_public_id_key" ON "public"."Message"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Emoji_user_id_message_id_emoji_uni_code_key" ON "public"."Emoji"("user_id", "message_id", "emoji_uni_code");

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Emoji" ADD CONSTRAINT "Emoji_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Emoji" ADD CONSTRAINT "Emoji_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
