const router = require('express').Router();
const weetsRoutes = require('./weetsRoutes');
const userRoutes = require('./userRoutes');

router.use('/weets', weetsRoutes);
router.use('/users', userRoutes);

module.exports = router;
