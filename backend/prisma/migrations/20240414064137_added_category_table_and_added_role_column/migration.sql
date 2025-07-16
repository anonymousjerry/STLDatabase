-- Alter User Table: Add 'role' column with default 'user'
ALTER TABLE "User"
ADD COLUMN role VARCHAR(191) DEFAULT 'user';

-- Create Category Table
CREATE TABLE "Category" (
    id VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY (id)
);