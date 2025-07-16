-- Product Table
CREATE TABLE "Product" (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    "mainImage" VARCHAR(191) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    rating INTEGER NOT NULL DEFAULT 0,
    description VARCHAR(191) NOT NULL,
    manufacturer VARCHAR(191) NOT NULL,
    category VARCHAR(191) NOT NULL,
    "inStock" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Product_pkey" PRIMARY KEY (id),
    CONSTRAINT "Product_slug_key" UNIQUE (slug)
);

-- Image Table
CREATE TABLE "Image" (
    "imageID" VARCHAR(191) NOT NULL,
    "productID" VARCHAR(191) NOT NULL,
    image VARCHAR(191) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("imageID")
);

-- User Table
CREATE TABLE "User" (
    id VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    password VARCHAR(191),

    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT "User_email_key" UNIQUE (email)
);