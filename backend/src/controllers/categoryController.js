const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.sTLProduct.findMany({
            select: {
                category: true
            },
            distinct: ['category']
        })

        const categoryList = categories.map((item) => item.category);
        res.status(200).json(categoryList);
    } catch(err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getAllCategories };