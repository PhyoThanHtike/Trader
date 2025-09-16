/*
  Warnings:

  - Added the required column `avgPrice` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "avgPrice" DOUBLE PRECISION NOT NULL;
