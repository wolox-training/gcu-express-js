// eslint-disable-next-line new-cap
const router = require('express').Router();
const protectedRoute = require('../middlewares/protectedRoute');
const validateSchema = require('../middlewares/validateSchema');
const { paginationSchema, calificationSchema } = require('../validations');
const weetController = require('../controllers/weetController');
const calificationController = require('../controllers/calificationController');

router.get('/', [protectedRoute, validateSchema(paginationSchema)], weetController.getWeets);
router.post('/', [protectedRoute], weetController.createWeet);
router.post(
  '/:id/ratings',
  [protectedRoute, validateSchema(calificationSchema)],
  calificationController.createCalification
);

module.exports = router;
