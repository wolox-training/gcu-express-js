// eslint-disable-next-line new-cap
const router = require('express').Router();
const validateSchema = require('../middlewares/validateSchema');
const { paginationSchema, calificationSchema } = require('../validations');
const weetController = require('../controllers/weetController');
const calificationController = require('../controllers/calificationController');
const checkJwt = require('../middlewares/checkJwt');

router.get('/', [checkJwt, validateSchema(paginationSchema)], weetController.getWeets);
router.post('/', [checkJwt], weetController.createWeet);
router.post(
  '/:id/ratings',
  [checkJwt, validateSchema(calificationSchema)],
  calificationController.createCalification
);

module.exports = router;
