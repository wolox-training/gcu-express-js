const { getUserPosition } = require('../services/userService');

module.exports = user => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  points: getUserPosition(user.points),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
