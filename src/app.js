// Khởi tạo Express app: middleware chung, mount router, phục vụ frontend, xử lý lỗi.
const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use('/api/v1', apiRoutes);

// Frontend tĩnh (HTML/CSS/JS thuần trong design/ui) — cùng origin với API.
const uiDir = path.join(__dirname, '..', 'design', 'ui');
app.get('/', (req, res) => res.redirect('/dang-nhap.html'));
app.use(express.static(uiDir));

// 404 + xử lý lỗi tập trung (đặt cuối cùng).
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
