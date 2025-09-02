const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllModels = async (req, res) => {
    try {
        const models = await prisma.sTLProduct.findMany();
        res.status(200).json(models);
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

module.exports = { getAllModels, likeModel, viewModel, downloadModel };