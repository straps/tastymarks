import fs from 'fs'
import path from 'path'
import Mailgun from 'mailgun-js'
import template from 'lodash.template'
import secrets from '../config/server-secrets'

const mailgun = Mailgun(secrets.mailgun)

export const sendMail = (to, subject, html, opts) => {
  return new Promise((resolve, reject) => {
    const data = Object.assign({
      from: 'TastyMarks <noreply@tastymarks.com>',
      to,
      subject,
      html
    }, opts)

    mailgun.messages().send(data, function (error, body) {
      console.log('sendMail, error=', error, ', body=', body)
      if (error) {
        reject(error)
      } else {
        resolve(body)
      }
    });

  })
}

export const sendMailTemplate = (to, subject, templateName, templateTags, opts) => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`)
  const templateContent = fs.readFileSync(templatePath, 'utf8')
  const compiledTemplate = template(templateContent)
  const html = compiledTemplate(templateTags)
  return sendMail(to, subject, html, opts)
}
