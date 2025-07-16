-- Drop existing foreign key constraint on userId
ALTER TABLE "Wishlist"
DROP CONSTRAINT IF EXISTS "Wishlist_userId_fkey";

-- Add foreign key constraint with ON DELETE CASCADE
ALTER TABLE "Wishlist"
ADD CONSTRAINT "Wishlist_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"(id)
ON DELETE CASCADE
ON UPDATE CASCADE;