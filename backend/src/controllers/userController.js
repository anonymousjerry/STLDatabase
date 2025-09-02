const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');

const prisma = new PrismaClient();

const register = async (req, res) => {
    const {username, email, password, role} = req.body;

    try {
        const hashed = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed,
                role,
            }
        })
        res.status(201).json(user);
    } catch(err) {
        console.error("Error creating user: ", err);
        res.status(400).json({ error: 'Eamil already exists or bad request! '});
    }
};

const login = async (req, res) => {
    const { email, password, recaptchaToken } = req.body;
    console.log(email, password)

    const  user = await prisma.user.findUnique({ where : { email }});
    console.log(user);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await comparePassword(password, user.password);
    console.log(valid);
    if (!valid) return res.status(401).json({ message: 'Invalid credential!' });

    const token = jwt.sign({ userName: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d'});
    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        },
        token: token   
    });
}

const googleAuth = async (req, res) => {
    try {
        const { email, name, picture, sub: googleId } = req.body;

        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email and name are required'
            });
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({ 
            where: { email }
        });

        if (!user) {
            // Create new user (without password for Google users)
            user = await prisma.user.create({
                data: {
                    email,
                    username: name,
                    role: 'user',
                    password: '', // Empty password for Google users
                }
            });
            console.log('New Google user created:', user.email);
        } else {
            // Update existing user's username if it's different
            if (user.username !== name) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { username: name }
                });
                console.log('Updated username for existing user:', user.email);
            } else {
                console.log('Existing user found:', user.email);
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Google authentication successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username || name,
                role: user.role,
                picture: picture
            },
            token: token
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during Google authentication'
        });
    }
};

const getUserFavourites = async (req, res) => {
    const { userId } = req.params;

    if (!userId){
        return res.status(404).json({ error: "User ID is required"});
    };

    try {
        const favourites = await prisma.favourite.findMany({
            where: {
                userId: userId
            },
            include: {
                model: {
                    include: {
                        sourceSite: true,
                        category: true,
                        subCategory: true,
                        likes: true,
                        favourites: true
                    }
                }
            }
        });

        const favouriteModels = favourites.map(fav => fav.model);

        res.status(200).json(favouriteModels);
    } catch(err){
        console.error('Error fetching favourite models: ', err);
        res.status(500).json({ error: 'Internal server error'});
    }
}

module.exports = { register, login, getUserFavourites, googleAuth };
