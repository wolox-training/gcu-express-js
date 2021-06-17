// eslint-disable-next-line new-cap
const router = require('express').Router();
const validateSchema = require('../middlewares/validateSchema');
const { userSchema, sessionSchema, auth0Schema } = require('../validations');
const userController = require('../controllers/userController');
const checkJwt = require('../middlewares/checkJwt');

router.get('/', [checkJwt], userController.getUsers);
router.post('/signup', [validateSchema(userSchema)], userController.createUser);
router.post('/sessions', [validateSchema(sessionSchema)], userController.session);
router.post('/login', [validateSchema(auth0Schema)], userController.login);
router.post('/sessions/invalidate_all', [checkJwt], userController.deleteSessions);

module.exports = router;
