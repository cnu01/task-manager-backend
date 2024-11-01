const express = require('express');
const connectDB = require('./src/config.js/db');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const passport = require('./src/services/googleAuth');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));