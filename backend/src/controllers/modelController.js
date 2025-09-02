const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllModels = async (req, res) => {
    const category = req.query.category;
    const key = req.query.key;
    const priceFilter = req.query.price;
    const sourceSite = req.query.sourcesite;
    const userId = req.query.userId;
    const showFavouritesOnly = req.query.favourited === 'true'
    const sortBy = req.query.sortby || "new"
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    try {
        let sourceSiteId, categoryId;
        if (sourceSite){
            const sourceSiteRecord = await prisma.sourceSite.findFirst({
                where: { name: sourceSite}
            })
            sourceSiteId = sourceSiteRecord.id
            // console.log(sourceSiteId)
        };

        if (category){
            const categoryRecord = await prisma.subCategory.findFirst({
                where: { name: category}
            })
            categoryId = categoryRecord.id
        }

        let priceCondition = {};
        if (priceFilter) {
            switch (priceFilter) {
                case "free": priceCondition = { priceValue: { equals: 0 }}; break;
                case "premium": priceCondition = { priceValue: { equals: -1 }}; break;
                case "under-10": priceCondition = { priceValue: { lt: 10, gt: 0 } }; break;
                case "10-25": priceCondition = { priceValue: { gte: 10, lte: 25 } }; break;
                case "25-50": priceCondition = { priceValue: { gt: 25, lte: 50 } }; break;
                case "50-100": priceCondition = { priceValue: { gt: 50, lte: 100 } }; break;
                case "over-100": priceCondition = { priceValue: { gt: 100 } }; break;
                default: priceCondition = {};
            }
        }

        let favouriteModelIds = [];

        if (showFavouritesOnly && userId){
            const favouriteRecords = await prisma.favourite.findMany({
                where: {userId},
                select: {modelId: true}
            });
            favouriteModelIds = favouriteRecords.map(f => f.modelId);

            if (favouriteModelIds.length === 0) {
                return res.status(200).json({
                    models: [],
                    page,
                    totalPages: 0,
                    hasMore: false,
                    totalCount: 0
                })
            }
        }

        const whereClause = {
            deleted: false,
            ...(sourceSite && { sourceSiteId: sourceSiteId }),
            ...(category && { subCategoryId : categoryId }),
            ...(key && {
                OR: [
                    { title : { contains: key, mode: 'insensitive' } },
                    { description : { contains: key, mode: 'insensitive' } },
                    { tags: { has : key } }
                ]
            }),
            ...(showFavouritesOnly && userId && {
                id: { in: favouriteModelIds }
            }),
            ...priceCondition
        };

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (sortBy === 'Featured'){
            const [models, total] = await Promise.all([
                prisma.model.findMany({
                    where: {
                        ...whereClause,
                        isFeatured: true
                    },
                    include: {
                        likes: true,
                        favourites: true,
                        sourceSite: true,
                        category: true,
                        subCategory: true
                    },
                    skip,
                    take: limit,
                    orderBy: {createdAt: 'desc'}
                })
            ]);

            const modelsWithFlag = models.map(model => ({
                ...model,
                isFavourited: model.favourites?.some(f => f.userId === userId)
            }));

            const totalPages = Math.ceil(total / limit);
            const hasMore = page < totalPages;

            return res.status(200).json({
                models: modelsWithFlag,
                page,
                totalPages,
                hasMore,
                totalCount: total
            });
        }

        if (sortBy === 'Popular' || sortBy === 'Trending'){
            const modelsBase = await prisma.model.findMany({
                where: whereClause,
                select: { id: true }
            });

            const modelIds = modelsBase.map(m => m.id);

            const [viewCounts, likeCounts, downloadCounts] = await Promise.all([
                prisma.viewEvent.groupBy({
                    by: ['modelId'],
                    where: {
                        modelId: { in: modelIds },
                        ...(sortBy === 'Trending' && { createdAt: { gte: sevenDaysAgo }})
                    },
                    _count: true
                }),
                prisma.like.groupBy({
                    by: ['modelId'],
                    where: {
                        modelId: { in: modelIds },
                        ...(sortBy === 'Trending' && { createdAt: { gte: sevenDaysAgo }})
                    },
                    _count: true
                }),
                prisma.downloadEvent.groupBy({
                    by: ['modelId'],
                    where: {
                        modelId: { in: modelIds },
                        ...(sortBy === 'Trending' && { createdAt: { gte: sevenDaysAgo }})
                    },
                    _count: true
                }),
            ]);

            const scoreMap = new Map();

            viewCounts.forEach(v => scoreMap.set(v.modelId, (scoreMap.get(v.modelId) || 0) + v._count*1));
            likeCounts.forEach(l => scoreMap.set(l.modelId, (scoreMap.get(l.modelId) || 0) + l._count*1));
            downloadCounts.forEach(d => scoreMap.set(d.modelId, (scoreMap.get(d.modelId) || 0) + d._count*1));

            const scoredModels = [...scoreMap.entries()]
                .sort((a ,b) => b[1] - a[1])
                .map(([modelId]) => modelId);
            
            const paginatedIds = scoredModels.slice(skip, skip+limit);

            const models = await prisma.model.findMany({
                where: { id: { in: paginatedIds } },
                include: {
                    likes: true,
                    favourites: true,
                    sourceSite: true,
                    category: true,
                    subCategory: true
                }
            });

            const modelMap = Object.fromEntries(models.map(m => [m.id, m]));
            const sortedModels = paginatedIds.map(id => modelMap[id]);

            const modelsWithFlag = sortedModels.map(model => ({
                ...model,
                isFavourited: model.favourites?.some(f => f.userId === userId)
            }));

            return res.status(200).json({
                models: modelsWithFlag,
                page,
                totalPages: Math.ceil(scoredModels.length / limit),
                hasMore: page < Math.ceil(scoredModels.length / limit),
                totalCount: scoredModels.length
            });
        }

        const [models, total] = await Promise.all([
            prisma.model.findMany({
                where: whereClause,
                include: {
                    likes: true,
                    favourites: true,
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
        ]);

        const modelsWithFlag = models.map(model => ({
            ...model,
            isFavourited: model.favourites?.some(f => f.userId === userId)
        }));

        // console.log(modelsWithFlag)

        const totalPages = Math.ceil(total/limit);
        const hasMore = page < totalPages;

        res.status(200).json({
            models: modelsWithFlag,
            page,
            totalPages,
            hasMore,
            totalCount: total
        })

    } catch(err) {
        console.error("Error fetching models: ", err);
        res.status(500).json({ error: 'Internal server error'})
    }
}

const likeModel = async (req, res) => {
    try {
        const { modelId, userId, recaptchaToken } = req.body;
        
        if (!modelId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Model ID and User ID are required'
            });
        }

        // Here you would typically update the like status in your database
        // For now, we'll just return a success response
        console.log('Model like action:', { modelId, userId, timestamp: new Date().toISOString() });

        res.status(200).json({
            success: true,
            message: 'Model liked successfully'
        });
    } catch (error) {
        console.error('Like model error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const viewModel = async (req, res) => {
    try {
        const { modelId, recaptchaToken } = req.body;
        
        if (!modelId) {
            return res.status(400).json({
                success: false,
                message: 'Model ID is required'
            });
        }

        // Here you would typically increment the view count in your database
        // For now, we'll just return a success response
        console.log('Model view action:', { modelId, timestamp: new Date().toISOString() });

        res.status(200).json({
            success: true,
            count: Math.floor(Math.random() * 100) + 1, // Mock count for demo
            message: 'View recorded successfully'
        });
    } catch (error) {
        console.error('View model error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const downloadModel = async (req, res) => {
    try {
        const { modelId, recaptchaToken } = req.body;
        
        if (!modelId) {
            return res.status(400).json({
                success: false,
                message: 'Model ID is required'
            });
        }

        // Here you would typically increment the download count in your database
        // For now, we'll just return a success response
        console.log('Model download action:', { modelId, timestamp: new Date().toISOString() });

        res.status(200).json({
            success: true,
            downloads: Math.floor(Math.random() * 50) + 1, // Mock count for demo
            message: 'Download recorded successfully'
        });
    } catch (error) {
        console.error('Download model error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
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

const getDailyModels = async (req, res) => {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        const [models, total] = await Promise.all([
            prisma.model.findMany({
                where: {
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                },
                include: {
                    likes: true,
                    sourceSite: true,
                    category: true,
                    subCategory: true
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.model.count({
                where: {
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            })
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        res.status(200).json({
            models,
            page,
            totalPages,
            hasMore,
            totalCount: total
        });
        // console.log(models)
    }catch(err){
        console.error('Error fetching daily discover: ', err);
        res.status(500).json({error: "Internal server error!"})
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
            res.status(200).json({ success: "successfully favourited!"})
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
            res.status(200).json({ success: "successfully remove favourite!"})
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

const handleModelDownload = async (req, res) => {
    const { modelId } = req.body
    try {
        const [updatedModel] = await prisma.$transaction([
            prisma.model.update({
                where: { id: modelId },
                data: { downloads: { increment: 1 } },
            }),

            prisma.downloadEvent.create({
                data: {
                    modelId
                }
            })
        ])
        res.status(200).json({ downloads : updatedModel.downloads })
    } catch(error) {
        console.error("Failed to record download: ", error);
        throw error;
    };
}

const modelView = async(req, res) => {
    const { modelId } = req.body;
    console.log( modelId)

    try {
        const [updatedModel] = await prisma.$transaction([
            prisma.model.update({
                where: { id: modelId },
                data: { views: { increment: 1 } },
            }),

            prisma.viewEvent.create({
                data: {
                    modelId
                }
            })
        ])
        res.status(200).json({
            count: updatedModel.views,
            message: "View count incremented successfully."
        })
    } catch(err){
        console.error("Error fetching models: ", err);
        res.status(500).json({error: 'Internal server error!'})
    }
}

module.exports = { getAllModels, getTrendingModels, modelLike, modelFavourite, getModel, getSimilars, handleModelDownload, modelView, getDailyModels };

