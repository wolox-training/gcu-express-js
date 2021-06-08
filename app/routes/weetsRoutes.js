// eslint-disable-next-line new-cap
const router = require('express').Router();
const protectedRoute = require('../middlewares/protectedRoute');
const validateSchema = require('../middlewares/validateSchema');
const { paginationSchema } = require('../validations');
const weetController = require('../controllers/weetController');

router.get('/', [protectedRoute, validateSchema(paginationSchema)], weetController.getWeets);

router.post('/', [protectedRoute], weetController.createWeet);

module.exports = router;
