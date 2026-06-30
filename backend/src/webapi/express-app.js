const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const centerRoutes = require('./routes/center.routes');
const volunteerRoutes = require('./routes/volunteer.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const catalogRoutes = require('./routes/catalog.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar rutas con prefijo de API
app.use('/api', healthRoutes);
app.use('/api', centerRoutes);
app.use('/api', volunteerRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', catalogRoutes);

module.exports = app;
