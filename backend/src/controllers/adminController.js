const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/hash')
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

dotenv.config({ path: path.join(__dirname, '../utils/.env')})

const prisma = new PrismaClient();
const endpoint = "https://s3.us-west-004.backblazeb2.com";
const bucketname = "3ddatabase";
const keyID = process.env.keyID;
const applicationKey = process.env.applicationKey;
const base_url = "https://img.3ddatabase.com/file/3ddatabase/";

const s3 = new S3Client({
    endpoint : endpoint,
    region: 'us-west-004',
    credentials: {
        accessKeyId: keyID,
        secretAccessKey: applicationKey
    }
})

const upload = multer({ storage: multer.memoryStorage() });

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "_")     // replace spaces with underscore
    .replace(/[^\w\-]+/g, "");  // remove special chars

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json(users);
    } catch(err){
        console.error('Error fetching Users: ', err);
        res.status(500).json({ error: 'Internal server error'});
    }
};

const updateUser = async(req, res) => {
    try {
        console.log(req.body.payload)
        const { id, username, email, role} = req.body.payload;

        if (!id) {
            return res.status(400).json({error: 'User ID is required'});
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(200).json(updatedUser)
    } catch(err) {
        console.error('Error Updating User: ', err);
        res.status(500).json({error: 'Interval server error!'})
    }
}

const createUser = async(req, res) => {
    try {
        const { username, email, role} = req.body.payload;
        console.log(req.body)

        default_password = "3ddatabase"
        const hashed = await hashPassword(default_password);

        const createdUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed,
                role,
            }
        });

        res.status(200).json(createdUser)
    } catch(err) {
        console.error('Error Updating User: ', err);
        res.status(500).json({error: 'Interval server error!'})
    }
}

const deleteUser = async (req, res) => {
    try{
        console.log(req.query)
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Delete user from database
        const deletedUser = await prisma.user.delete({
            where: { id: userId }
        });

        res.status(200).json({ message: 'User deleted successfully'});

    } catch(err){
        console.error('Error Deleting User: ', err);
        res.status(500).json({ error: 'Internal server error'});
    }
}

const getAllSubcategories = async (req, res) => {
    try {
        const categories = await prisma.subCategory.findMany({
            include: {
                category: {
                    select: {
                        name: true,
                        id: true,
                    }
                }
            }
        })

        const subcategoryList = categories.map((item) => ({
            name: item.name,
            baseId : item.id,
            id: item.category.id,
            category: item.category.name,
            iconUrl : item.iconUrl
        }));
        res.status(200).json(subcategoryList);
    } catch(err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateSubCategory = async (req, res) => {
    try {
        const { subCategoryId, name } = req.body;
        const file = req.file;

        if (!subCategoryId){
            return res.status(400).json({ error: 'subCategoryId is required'});
        }

        
        const updateData = {};
        let uploadedFileKey;

        if (file){
            uploadedFileKey = `category/${slugify(name)}.png`

            const uploadParmas = {
                Bucket: bucketname,
                Key: uploadedFileKey,
                Body: file.buffer,
                ACL: 'public-read',
                ContentType: "image/png"
            };

            await s3.send(new PutObjectCommand(uploadParmas));
            updateData.iconUrl = base_url + uploadedFileKey;
        }

        if (name) updateData.name = name;

        const updatedSubCategory = await prisma.subCategory.update({
            where: { id: subCategoryId },
            data: updateData,
        });

        res.status(200).json(updatedSubCategory);
        
    } catch(err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const createSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryName } = req.body;
        const file = req.file;

        if (!categoryId || !subCategoryName || !file){
            return res.status(400).json({ error: "Cannot create Subcategory!"});
        };

        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        console.log(category);

        if (!category) {
            return res.status(404).json({ error: `Category is not found`});
        };

        const uploadedFileKey = `category/${slugify(subCategoryName)}.png`;

        const uploadParams = {
            Bucket: bucketname,
            Key: uploadedFileKey,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: "image/png"
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const newSubCategory = await prisma.subCategory.create({
            data: {
                name: subCategoryName,
                categoryId: category.id,
                iconUrl: base_url + uploadedFileKey
            }
        });

        res.status(200).json(newSubCategory);
        
    } catch(err) {
        console.error("Error creating categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteSubCategory = async(req, res) => {
    try {
        const { subCategoryId } = req.query;

        if(!subCategoryId) {
            return res.status(400).json({ error: "subCategoryId is required" });
        }

        const subCategory = await prisma.subCategory.findUnique({
            where: { id: subCategoryId },
            include: {
                category: true
            }
        });

        if (!subCategory) {
            return res.status(404).json({ error: "Subcategory not found"});
        }
        const categoryId = subCategory.category.id;

        let otherSubCategory = await prisma.subCategory.findFirst({
            where: { name: "Other"},
        });

        let otherCategory = await prisma.category.findFirst({
            where: {name: "Other"},
        });

        await prisma.model.updateMany({
            where: { subCategoryId },
            data: { 
                subCategoryId: otherSubCategory.id,
                categoryId: otherCategory.id, 
            },
        });

        await prisma.subCategory.delete({
            where: { id: subCategoryId },
        });

        res.status(200).json({ message: "Subcategory deleted successfully" });
    
    } catch(err){
        console.error("Error deleting subcategory: ", err);
        res.status(500).json({ error: "Internal server error!"});
    }
}

const createCategory = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files)
        const { name, subCategories} = req.body;
        const files = req.files;

        if (!name || !subCategories){
            return res.status(400).json({ error: "Category name and subCategories are required" });
        }

        const category = await prisma.category.create({
            data: { name: name}
        });

        const createdSubCategories = [];

        for(let i=0; i<subCategories.length; i++){
            const sub = subCategories[i];
            const file = files[i];

            if(!sub.name || !file) continue;
            const uploadedFileKey = `category/${slugify(sub.name)}.png`;

            const uploadParams = {
                Bucket: bucketname,
                Key: uploadedFileKey,
                Body: file.buffer,
                ACL: "public-read",
                ContentType: "image/png"
            };

            await s3.send(new PutObjectCommand(uploadParams));

            const newSub = await prisma.subCategory.create({
                data: {
                    name: sub.name,
                    categoryId: category.id,
                    iconUrl: base_url + uploadedFileKey
                }
            });

            createdSubCategories.push(newSub);
        };

        return res.status(201).json({
            category,
            subCategories: createdSubCategories
        })
    } catch(err){
        console.error("Error creating category: ", err);
        res.status(500).json({ error: "Internal server error"});
    }
}

const getAllModels = async (req, res) => {
    try {
        const models = await prisma.model.findMany({
            include: {
                likes: true,
                sourceSite: true,
                category: true,
                subCategory: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        const modelList = models.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            source: item.sourceSite.name,
            category: item.category.name,
            subCategory: item.subCategory.name,
            tags: item.tags,
            download: item.downloads,
            view: item.views,
            like: item.likes.length,
            price: item.price,
            thumbnailUrl: item.thumbnailUrl,
            sourceUrl: item.sourceUrl,
            isFeatured: item.isFeatured
        }));

        res.status(200).json(modelList)
    } catch(err) {
        console.error("Error fetching models: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateModel = async (req, res) => {
    try {
        console.log(req.body);
        const { id, title, description, isFeatured } = req.body;

        if (!id) {
            return res.status(400).json({error: 'Model ID is required'});
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (isFeatured) updateData.isFeatured = isFeatured;

        const updatedModel = await prisma.model.update({
            where: { id },
            data: updateData
        });

        res.status(200).json({ message: "Model is updated successfully!"})
    } catch(err) {
        console.error("Error fetching models: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteModel = async (req, res) => {
    try {
        console.log(req.query);
        const { modelId } = req.query;

        if (!modelId) {
            return res.status(400).json({error: 'Model ID is required'});
        }

        const deleteModel = await prisma.model.delete({
            where: { id: modelId }
        });

        res.status(200).json({ message: 'Model deleted successfully'});
    } catch(err) {
        console.error("Error deleting models: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    createUser, 
    getAllSubcategories, 
    updateSubCategory, 
    createSubCategory,
    createCategory,
    getAllModels, 
    updateModel,
    deleteModel,
    upload 
};