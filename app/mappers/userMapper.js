/**
 * This is the user response.
 * Added in order to avoid return password as response.
 */
class UserResponse {
  constructor({ id, name, email, last_name, createdAt } = {}) {
    this.id = id;
    this.name = name;
    this.last_name = last_name;
    this.email = email;
    this.created_at = createdAt;
    this.updated_at = createdAt;
  }
}

const UserMapper = function UserMapper(userDoc) {
  return new UserResponse(userDoc);
};

module.exports = UserMapper;
