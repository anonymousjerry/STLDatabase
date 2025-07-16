/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- Create unique index on Category.name
CREATE UNIQUE INDEX "Category_name_key" ON "Category"(name);