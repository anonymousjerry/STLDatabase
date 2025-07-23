const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllModels = async (req, res) => {

    const { platform, category, key} = req.query;

    try {
        const models = await prisma.sTLProduct.findMany({
            where: {
                ...(platform && { platform: platform }),
                ...(category && { category: category }),
                ...(key && {
                    OR: [
                        { title : { contains: key, mode: 'insensitive' } },
                        { description : { contains: word, mode: 'insensitive' } },
                        { tags: { has : word } }
                    ]
                })
            }
        });
        res.status(200).json(models);
    } catch(err) {
        console.error("Error fetching models: ", err);
        res.status(500).json({ error: 'Internal server error'})
    }
}

module.exports = { getAllModels };