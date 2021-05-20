const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message =>
  internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.VALIDATION_ERROR = 'validation_error';
exports.validationError = message =>
  internalError(message, exports.VALIDATION_ERROR);

exports.errorMessages = {
  emailRequired: 'Email requerido',
  invalidEmail: 'Email no válido',
  invalidEmailResource: 'Email no válido, no pertenece a Wolox',
  invalidPassword: 'Contraseña no válida',
  passwordRequired: 'Contraseña requerida',
  nameRequired: 'Nombre requerido',
  lastNameRequired: 'Apellido requerido',
  existingUser: 'Usuario existente'
};
