const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllSubcategories = async (req, res) => {
    try {
        const categories = await prisma.subCategory.findMany({
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })

        const subcategoryList = categories.map((item) => ({
            name: item.name,
            category: item.category.name,
            iconUrl: item.iconUrl
        }));
        res.status(200).json(subcategoryList);
    } catch(err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getAllSubcategories };