-- Create Wishlist Table
CREATE TABLE "Wishlist" (
    id VARCHAR(191) NOT NULL,
    "productId" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY (id)
);

-- Add Foreign Key on productId
ALTER TABLE "Wishlist"
ADD CONSTRAINT "Wishlist_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Add Foreign Key on userId
ALTER TABLE "Wishlist"
ADD CONSTRAINT "Wishlist_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;