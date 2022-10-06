const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const compression = require("compression")
const morgan = require("morgan")

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { productsRouter } = require('./routes/products.routes');
const { cartRouter } = require('./routes/cart.routes');

// Init express app
const app = express();

// Enable CORS
app.use(cors());

app.use(helmet())
app.use(compression())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan("dev"))
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan("combined"))
}

// Enable incoming JSON data
app.use(express.json());

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
