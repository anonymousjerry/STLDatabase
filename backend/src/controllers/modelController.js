const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllModels = async (req, res) => {

    // const { category, platform, key} = req.query;
    const category = req.query.category
    const key = req.query.key
    const sourceSite = req.query.sourcesite
    console.log(req.query)

    
    try {
        let sourceSiteId, categoryId;
        if (sourceSite){
            const sourceSiteRecord = await prisma.sourceSite.findFirst({
                where: { name: sourceSite}
            })
            sourceSiteId = sourceSiteRecord.id
            console.log(sourceSiteId)
        };

        if (category){
            const categoryRecord = await prisma.subCategory.findFirst({
                where: { name: category}
            })
            categoryId = categoryRecord.id
        }


        const models = await prisma.model.findMany({
            where: {
                ...(sourceSite && { sourceSiteId: sourceSiteId }),
                ...(category && { subCategoryId : categoryId }),
                ...(key && {
                    OR: [
                        { title : { contains: key, mode: 'insensitive' } },
                        { description : { contains: key, mode: 'insensitive' } },
                        { tags: { has : key } }
                    ]
                })
            }
        });

        console.log(models.length)
        res.status(200).json(models);
    } catch(err) {
        console.error("Error fetching models: ", err);
        res.status(500).json({ error: 'Internal server error'})
    }
}

const getTrendingModels = async (req, res) => {
    try {
        const models = await prisma.model.findMany({
            orderBy: {
                downloads: 'desc'
            }
        })

        res.status(200).json(models)
    }catch(err){
        console.error("Error fetching models: ", err);
        res.status(500).json({error: 'Internal server error!'})
    }
}

module.exports = { getAllModels, getTrendingModels };