CREATE TABLE "Order" (
    id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL,
    lastname VARCHAR(191) NOT NULL,
    phone VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    company VARCHAR(191),
    adress VARCHAR(191) NOT NULL,
    apartment VARCHAR(191),
    city VARCHAR(191) NOT NULL,
    country VARCHAR(191) NOT NULL,
    "postalCode" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY (id),
    CONSTRAINT "Order_email_key" UNIQUE (email)
);