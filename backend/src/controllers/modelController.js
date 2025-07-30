const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllModels = async (req, res) => {

    // const { category, platform, key} = req.query;
    const category = req.query.category;
    const key = req.query.key;
    const sourceSite = req.query.sourcesite;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    // console.log(req.query)

    
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

        const whereClause = {
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

        const [models, total] = await Promise.all([
            prisma.model.findMany({
                where: whereClause,
                include: {
                    likes: true,
                    sourceSite: true,
                    category: true,
                    subCategory: true
                },
                skip,
                take : limit,
                orderBy: {createdAt: 'desc'}
            }),
            prisma.model.count({
                where: whereClause
            })
        ])

        const totalPages = Math.ceil(total/limit);
        const hasMore = page < totalPages;

        res.status(200).json({
            models,
            page,
            totalPages,
            hasMore,
            totalCount: total
        })

        // console.log(models)
        // res.status(200).json(models);
    } catch(err) {
        console.error("Error fetching models: ", err);
        res.status(500).json({ error: 'Internal server error'})
    }
}

const getModel = async (req, res) => {
    const id = req.query.modelId;

    try {
        const model = await prisma.model.findUnique({
            where: {
                id: id
            },
            include: {
                likes: true,
                sourceSite: true,
                category: true,
                subCategory: true
            }
        })

        // console.log(model)

        if (!model) {
            return res.status(404).json({ error: 'Model not found!'});
        }

        res.status(200).json(model);
    } catch (err) {
        console.error('Error fetching model by ID: ', err)
        res.status(500).json({ error: "internal server error!" });
    }
}

const getTrendingModels = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        const [models, total] = await Promise.all([
            prisma.model.findMany({
                orderBy: {
                    downloads: 'desc'
                },
                include: {
                    likes: true,
                    sourceSite: true,
                    category: true,
                    subCategory: true
                },
                skip,
                take: limit
            }),
            prisma.model.count()
        ]);

        const totalPages = Math.ceil(total/limit);
        const hasMore = page < totalPages;

        return res.status(200).json({
            models,
            page,
            totalPages,
            hasMore,
            totalCount: total
        });

    }catch(err){
        console.error("Error fetching models: ", err);
        res.status(500).json({error: 'Internal server error!'})
    }
}

const modelLike = async(req, res) => {
    const { userId, modelId } = req.body;
    console.log(userId, modelId)

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_modelId: {
                    userId,
                    modelId,
                },
            },
        });


        if (!existingLike){
            await prisma.like.create({
                data: {
                    userId,
                    modelId
                }
            }) 
            // await getAllModels()
            res.status(200).json({ success: "successfully liked"})
        } 
        else{
            await prisma.like.delete({
                where: {
                    userId_modelId: {
                        userId,
                        modelId,
                    },
                },
            })
            // await getAllModels()
            res.status(200).json({ success: "successfully disliked!"})
        } 

    } catch(err){
        console.error("Error fetching models: ", err);
        res.status(500).json({error: 'Internal server error!'})
    }
}

const modelFavourite = async(req, res) => {
    const { userId, modelId } = req.body;
    console.log(userId, modelId)

    try {
        const existingFavourite = await prisma.favourite.findUnique({
            where: {
                userId_modelId: {
                    userId,
                    modelId,
                },
            },
        });


        if (!existingFavourite){
            await prisma.favourite.create({
                data: {
                    userId,
                    modelId
                }
            }) 
            res.status(200).json({ success: "successfully liked"})
        } 
        else{
            await prisma.favourite.delete({
                where: {
                    userId_modelId: {
                        userId,
                        modelId,
                    },
                },
            })
            res.status(200).json({ success: "successfully disliked!"})
        } 

    } catch(err){
        console.error("Error fetching models: ", err);
        res.status(500).json({error: 'Internal server error!'})
    }
};

const getSimilars = async (req, res) => {

    const modelId = req.query.modelId;

    
    try {
        const model = await prisma.model.findUnique({
            where: { id: modelId },
            include: { subCategory: true, }
        });

        if (!model) return res.status(404).json({ error: "Model not found!" });

        const similarModels = await prisma.model.findMany({
            where: {
                id: { not: modelId},
                subCategoryId: model.subCategoryId,
                OR: [
                    { tags : { hasSome: model.tags}},
                    { title: { contains: model.title.split(" ")[0], mode: 'insensitive'}}
                ]
            },
            take: 12,
            orderBy: { createdAt: 'desc'},
            include: {
                likes: true,
                sourceSite: true,
                category: true,
                subCategory: true
            }
        });

        res.status(200).json({ similarModels,})

        // console.log(models)
        // res.status(200).json(models);
    } catch(err) {
        console.error("Error fetching models: ", err);
        res.status(500).json({ error: 'Internal server error'})
    }
}

module.exports = { getAllModels, getTrendingModels, modelLike, modelFavourite, getModel, getSimilars };