// eslint-disable-next-line new-cap
const router = require('express').Router();
const validateSchema = require('../middlewares/validateSchema');
const protectedRoute = require('../middlewares/protectedRoute');
const { userSchema, sessionSchema } = require('../validations');
const userController = require('../controllers/userController');

router.get('/', [protectedRoute], userController.getUsers);
router.post('/signup', [validateSchema(userSchema)], userController.createUser);
router.post('/sessions', [validateSchema(sessionSchema)], userController.login);
router.post('/sessions/invalidate_all', [protectedRoute], userController.deleteSessions);

module.exports = router;
