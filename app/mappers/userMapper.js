/**
 * This is the user response.
 * Added in order to avoid return password as response.
 */
class UserResponse {
  constructor({ id, firstName, lastName, email, createdAt, updatedAt } = {}) {
    this.id = id;
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
    this.created_at = createdAt;
    this.updated_at = updatedAt;
  }
}

const UserMapper = function UserMapper(userDoc) {
  return new UserResponse(userDoc);
};

module.exports = UserMapper;
