const { check } = require('express-validator');

exports.validateLogin = [
  check('email', 'Email requerido').notEmpty(),
  check('email', 'Email no válido').isEmail(),
  check('email', 'Email no válido').custom(email => {
    if (
      !email
        .trim()
        .toLowerCase()
        .includes('@wolox')
    )
      throw new Error('Email no válido, no pertenece a Wolox');

    return true;
  }),
  check('password', 'Contraseña requerida').notEmpty(),
  check('password', 'Contraseña no válida').isLength({ min: 8 }),
  check('password', 'Contraseña no válida').isAlphanumeric()
];

exports.validateRegister = [
  check('name', 'Nombre requerido').notEmpty(),
  check('surname', 'Apellido requerido').notEmpty(),
  ...this.validateLogin
];
