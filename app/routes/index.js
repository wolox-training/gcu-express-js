// eslint-disable-next-line new-cap
const router = require('express').Router();
const { healthCheck } = require('../controllers/healthCheck');
const weetsRoutes = require('./weetsRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');

router.get('/health', healthCheck);
router.use('/weets', weetsRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
