-- Drop existing foreign key constraint on categoryId
ALTER TABLE "Product"
DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";

-- Add foreign key constraint with ON DELETE CASCADE and ON UPDATE CASCADE
ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"(id)
ON DELETE CASCADE
ON UPDATE CASCADE;