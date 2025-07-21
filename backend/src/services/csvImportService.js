const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importCsvToDatabase(filepath){
    const records= [];

    fs.createReadStream(filepath)
    .pipe(csv())
    .on("data", (row) => {
      records.push({
        title: row.title,
        platform: row.Platform,
        category: row.category,
        subcategory: row.subcategory,
        likes: parseInt(row.likes || "0"),
        downloads: parseInt(row.downloads || "0"),
        views: parseInt(row.views || "0"),
        tags: row.tags ? row.tags
            .replace(/[\[\]{}']/g, '')       // remove PostgreSQL array brackets and quotes
            .split(',')
            .map(tag => tag.trim())        // trim whitespace
            .filter(tag => tag.length > 0) // remove empty strings
        : [],
        thumbnailUrl: row.thumbnail_url,
      });
    })
    .on("end", async () => {
      for (const record of records) {
        await prisma.STLProduct.create({ data: record });
      }
      console.log("Imported successfully!");
      await prisma.$disconnect();
    });
};

importCsvToDatabase("../../../crawler/models_info.csv");