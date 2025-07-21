const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllSubcategories = async (req, res) => {
    try {
        const categories = await prisma.subCategory.findMany({
            select: {
                name: true
            }
        })

        const subcategoryList = categories.map((item) => item.name);
        res.status(200).json(subcategoryList);
    } catch(err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getAllSubcategories };