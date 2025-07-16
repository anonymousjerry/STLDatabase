-- Create Table
CREATE TABLE "customer_order_product" (
    id VARCHAR(191) NOT NULL,
    "customerOrderId" VARCHAR(191) NOT NULL,
    "productId" VARCHAR(191) NOT NULL,
    quantity INTEGER NOT NULL,

    CONSTRAINT "customer_order_product_pkey" PRIMARY KEY (id)
);

-- Add Foreign Key to Customer_order
ALTER TABLE "customer_order_product"
ADD CONSTRAINT "customer_order_product_customerOrderId_fkey"
FOREIGN KEY ("customerOrderId") REFERENCES "Customer_order"(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Add Foreign Key to Product
ALTER TABLE "customer_order_product"
ADD CONSTRAINT "customer_order_product_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;