const router = require('express').Router();
const { getWeet } = require('../controllers/weetsController');

router.get('/', [], getWeet);

module.exports = router;
