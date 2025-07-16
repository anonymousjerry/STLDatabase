-- Drop existing foreign key constraint on productId
ALTER TABLE "Wishlist"
DROP CONSTRAINT IF EXISTS "Wishlist_productId_fkey";

-- Add foreign key constraint with ON DELETE CASCADE and ON UPDATE CASCADE
ALTER TABLE "Wishlist"
ADD CONSTRAINT "Wishlist_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"(id)
ON DELETE CASCADE
ON UPDATE CASCADE;