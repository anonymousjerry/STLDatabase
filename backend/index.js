const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const modelRoutes = require('./src/routes/modelRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const siteRoutes = require('./src/routes/siteRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api', contactRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/subcategories', categoryRoutes);
app.use('/api/sites', siteRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));