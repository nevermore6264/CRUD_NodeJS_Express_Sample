require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/api/product', require('./controller/product.controller')); // Route cho các thao tác liên quan đến sản phẩm
app.use('/api/category', require('./controller/category.controller')); // Route cho các thao tác liên quan đến danh mục
app.use('/api/auth', require('./controller/auth.controller')); // Route cho các thao tác liên quan đến xác thực (login, signup) - Bổ sung Auth Controller

// global error handler
app.use(errorHandler); // Xử lý lỗi toàn cục

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port '
