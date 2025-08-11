const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { registerUser, loginUser } = require('./controllers/authController');
const productRoutes = require('./routes/productRoute'); // note: you used productRoute in one place, productRoutes in another


dotenv.config();

const app = express(); // must come BEFORE app.use calls

connectDB();

app.use(express.json());
app.use(cors());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
