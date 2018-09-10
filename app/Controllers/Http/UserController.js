'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const transaction = await Database.beginTransaction()

    // input returns only 1 information from the body of the request
    const addresses = request.input('addresses')

    const user = await User.create(data, transaction)

    await user.addresses().createMany(addresses, transaction)

    await transaction.commit()

    return user
  }
}

module.exports = UserController
