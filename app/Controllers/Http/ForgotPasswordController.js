'use strict'

const User = use('App/Models/User')
const crypto = require('crypto')

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
        } catch (err) {
            return response.status(err.status).send({ error: { message: 'Something did not work. Do the e-mail exists?' } })
        }
    }
}

module.exports = ForgotPasswordController
