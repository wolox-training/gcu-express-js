const router = require('express').Router();
const weetsRoutes = require('./weetsRoutes');

router.use('/weets', weetsRoutes);

module.exports = router;
