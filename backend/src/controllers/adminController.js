const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/hash')

const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({});

        res.status(200).json(users);
    } catch(err){
        console.error('Error fetching Users: ', err);
        res.status(500).json({ error: 'Internal server error'});
    }
};

const updateUser = async(req, res) => {
    try {
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
        
    } catch(err) {
        console.error("Error fetching categories: ", err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { getAllUsers, updateUser, deleteUser, createUser, getAllSubcategories, updateSubCategory };