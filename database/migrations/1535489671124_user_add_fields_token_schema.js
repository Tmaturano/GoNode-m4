'use strict'

const Schema = use('Schema')

class UserAddFieldsTokenSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table.string('token')
      table.timestamp('token_created_at')
    })
  }

  down () {
    this.alter('users', (table) => {
      // reverse alternations
      table.dropColumn('token')
      table.dropColumn('token_created_ad')
    })
  }
}

module.exports = UserAddFieldsTokenSchema
