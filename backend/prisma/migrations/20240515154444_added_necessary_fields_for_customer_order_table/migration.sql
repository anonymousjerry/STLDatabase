-- 1. Add the new columns as nullable first
ALTER TABLE "Customer_order"
ADD COLUMN city VARCHAR(191),
ADD COLUMN country VARCHAR(191),
ADD COLUMN "orderNotice" VARCHAR(191);

-- 2. (Optional) Backfill existing rows with default values for city and country
-- UPDATE "Customer_order" SET city = 'default_city' WHERE city IS NULL;
-- UPDATE "Customer_order" SET country = 'default_country' WHERE country IS NULL;

-- 3. Alter the columns to set NOT NULL constraint after data backfill
ALTER TABLE "Customer_order"
ALTER COLUMN city SET NOT NULL,
ALTER COLUMN country SET NOT NULL;