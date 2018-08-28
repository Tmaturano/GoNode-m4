'use strict'

const User = use('App/Models/User')
const crypto = require('crypto')
const Mail = use('Mail')

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
                        .from('thiago@teste.com.br', 'Thiago | Teste')
                        .subject('Password Recovery')
                })
        } catch (err) {
            return response.status(err.status).send({ error: { message: 'Something did not work. Do the e-mail exists?' } })
        }
    }
}

module.exports = ForgotPasswordController
