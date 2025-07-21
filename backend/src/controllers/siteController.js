const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllSites = async (req, res) => {
    try {
        console.log('Fetching all sites')
        const sites = await prisma.sourceSite.findMany({
            select: {
                name: true,
                url: true,
            }
        })

        const siteLists = sites.map((item) => [item.name, item.url]);
        res.status(200).json(siteLists);
    } catch(err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getAllSites };