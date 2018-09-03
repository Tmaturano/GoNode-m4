'use strict'

class User {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|unique:users', // user name unique for each user
      email: 'required|email|unique:users',
      password: 'required|confirmed'
    }
  }
}

module.exports = User
