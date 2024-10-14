const bcrypt = require('bcryptjs');

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = User;