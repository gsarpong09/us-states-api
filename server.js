import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import statesRoutes from './routes/states.js';
import { notFoundHandler } from './middleware/notFound.js';
import connectDB from './config/dbConn.js';

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve basic index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes
app.use('/states', statesRoutes);

// Catch-all for undefined routes
app.use(notFoundHandler);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));