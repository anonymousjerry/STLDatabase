-- Drop the old `order` table
DROP TABLE IF EXISTS "Order";

-- Create the new `Customer_order` table
CREATE TABLE "Customer_order" (
    id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL,
    lastname VARCHAR(191) NOT NULL,
    phone VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    company VARCHAR(191) NOT NULL,
    adress VARCHAR(191) NOT NULL,
    apartment VARCHAR(191) NOT NULL,
    "postalCode" VARCHAR(191) NOT NULL,
    "dateTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(191) NOT NULL,
    total INTEGER NOT NULL,

    CONSTRAINT "Customer_order_pkey" PRIMARY KEY (id)
);