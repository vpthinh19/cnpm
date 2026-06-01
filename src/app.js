// Khởi tạo Express app: middleware chung, mount router, xử lý lỗi.
const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use('/api/v1', apiRoutes);

// 404 + xử lý lỗi tập trung (đặt cuối cùng).
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
