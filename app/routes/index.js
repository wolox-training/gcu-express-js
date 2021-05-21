// eslint-disable-next-line new-cap
const router = require('express').Router();
const { healthCheck } = require('../controllers/healthCheck');
const weetsRoutes = require('./weetsRoutes');
const userRoutes = require('./userRoutes');

router.get('/health', healthCheck);
router.use('/weets', weetsRoutes);
router.use('/users', userRoutes);

module.exports = router;
