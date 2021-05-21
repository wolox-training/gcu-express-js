const router = require('express').Router();
const { healthCheck } = require('../controllers/healthCheck');
const weetsRoutes = require('./weetsRoutes');

router.get('/health', healthCheck);
router.use('/weets', weetsRoutes);

module.exports = router;
