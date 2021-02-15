module.exports = ({ env }) => ({
    email: {
        provider: 'nodemailer',
        providerOptions: {
            host: env('SMTP_HOST', 'localhost'),
            port: env('SMTP_PORT', 587),
            auth: {
                user: env('SMTP_USERNAME'),
                pass: env('SMTP_PASSWORD')
            }
        },
        settings: {
            defaultFrom: env('SMTP_FROM'),
            defaultReplyTo: env('SMTP_REPLY_TO')
        }
    }
})