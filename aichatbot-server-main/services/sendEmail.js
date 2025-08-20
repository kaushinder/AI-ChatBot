import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async (to, subject, text) => {
    try {
        await sgMail.send({
            to,
            from: process.env.SENDGRID_SENDER_EMAIL,
            subject,
            text,
        })
        console.log('Email sent successfully')
    } catch (err) {
        console.log('Error sending email', err)
    }
}