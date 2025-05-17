// server.js (CommonJS with route debug logging)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/dbConn');
const statesRoutes = require('./routes/states');
const verifyState = require('./middleware/verifyState');

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Mount states API routes with safety logging
try {
  app.use('/states', statesRoutes);
} catch (err) {
  console.error('ROUTE MOUNT ERROR:', err);
}

// Log all registered routes for debugging
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    console.log('ROUTE:', middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach(handler => {
      if (handler.route) {
        console.log('NESTED ROUTE:', handler.route.path);
      }
    });
  }
});

// Catch-all for unhandled routes
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.send('<h1>404 Not Found</h1>');
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
