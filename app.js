const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConfig')
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors());
    
//db con
connectDB();

// use routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth',authRoutes);

app.get('/hello', (req, res) => {
    res.send('Lakshan chinthaka')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})



