'use strict'

const User = use('App/Models/User')
const crypto = require('crypto')
const Mail = use('Mail')
const moment = require('moment')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      // if not find, Adonis returns an error with OrFail
      const user = await User.findByOrFail('email', email)

      // token with 10 bytes and converted to hexadecimal
      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()
      await Mail.send(
        ['emails.forgot_password'], // template
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` }, // variable for the template
        message => {
          message
            .to(user.email)
            .from('thiago@gonodeadonis.com.br', 'Thiago | GoNodeAdonis')
            .subject('Password Recovery')
        })
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Something did not work. Do the e-mail exists?' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      // checking if the token has more than 2 days
      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'Token is expired' } })  
      }

      user.token = null
      user.token_created_at = null
      user.password = password
      
      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Something did not work when trying to reset your password' } })
    }
  }
}

module.exports = ForgotPasswordController
