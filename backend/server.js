const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/mentor', require('./routes/mentorRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.post('/api/ai/predict', require('./controllers/AIController').predictSales);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'MSMS Backend' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
