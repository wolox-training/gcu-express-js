const router = require('express').Router();
const weetsRoutes = require('./weetsRoutes');

router.get('/', (_, res) => res.status(200).json(process.uptime()));
// resources
router.use('/weets', weetsRoutes);

module.exports = router;
