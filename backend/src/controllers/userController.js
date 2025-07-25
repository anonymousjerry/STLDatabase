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
    const { email, password } = req.body;
    console.log(email, password)

    const  user = await prisma.user.findUnique({ where : { email }});
    console.log(user);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await comparePassword(password, user.password);
    console.log(valid);
    if (!valid) return res.status(401).json({ message: 'Invalid credential!' });

    const token = jwt.sign({ userName: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d'});
    res.status(200).json({
        email : user.email,
        username : user.username,
        id : user.id,
        token : token   
    });
}

module.exports = { register, login };