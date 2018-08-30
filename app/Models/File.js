'use strict'

const Model = use('Model')
const Env = use('Env')

class File extends Model {
  // virtual field (computed) that does not exists in the table
  static get computed () {
    return ['url']
  }
  // everytime we need to show a file in the fron-end, we put the url together in the return
  getUrl ({ id }) {
    return `${Env.get('APP_URL')}/files/${id}`
  }
}

module.exports = File
