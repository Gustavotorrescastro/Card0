import nodemailer from 'nodemailer'
import path from 'path'

const hasSmtpCredentials = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)

const transportOptions = hasSmtpCredentials ? {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
} : {
    streamTransport: true,
    newline: 'unix',
    buffer: true,
}

const transporter = nodemailer.createTransport(transportOptions as any)

const fromEmail = process.env.SMTP_USER || 'no-reply@card0.local'
const card0LogoPath = path.join(process.cwd(), 'card0.png')
const card0LogoAttachment = {
    filename: 'card0.png',
    path: card0LogoPath,
    cid: 'card0-logo',
}
const defaultBaseUrl = 'https://card0-edenred.vercel.app'

const getBaseUrl = () => {
    return (process.env.NEXT_PUBLIC_BASE_URL || defaultBaseUrl).replace(/\/$/, '')
}

export async function sendVerificationEmail(
    toEmail: string,
    toName: string,
    token: string
) {
    const baseUrl = getBaseUrl()
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

    await transporter.sendMail({
        from: `"Card0" <${fromEmail}>`,
        to: toEmail,
        subject: 'Verifique seu e-mail – Card0',
        html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0;padding:0;background:#f3f3f3;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f3;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 12px 28px rgba(0,0,0,0.14);border:1px solid #ffe1de;">
                <!-- Header -->
                <tr>
                  <td style="background:#ffffff;padding:28px 40px 20px;text-align:center;border-top:5px solid #ff2b1d;">
                    <img src="cid:card0-logo" alt="Card0" width="132" style="display:block;margin:0 auto;max-width:132px;height:auto;" />
                    <p style="margin:14px 0 0;color:#ff2b1d;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Verificação de e-mail</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:34px 40px 32px;">
                    <h2 style="margin:0 0 16px;color:#111111;font-size:24px;font-weight:800;letter-spacing:-0.3px;">Olá, ${toName}!</h2>
                    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">
                      Obrigado por se cadastrar no <strong>Card0</strong>. Para ativar sua conta, clique no botão abaixo para verificar seu e-mail.
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                      <tr>
                        <td style="background:#ff2b1d;border-radius:999px;text-align:center;box-shadow:0 10px 22px rgba(255,43,29,0.22);">
                          <a href="${verifyUrl}"
                            style="display:inline-block;padding:14px 38px;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;letter-spacing:0.2px;">
                            Verificar e-mail
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 8px;color:#777;font-size:13px;">
                      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                    </p>
                    <p style="margin:0;word-break:break-all;">
                      <a href="${verifyUrl}" style="color:#ff2b1d;font-size:12px;font-weight:700;">${verifyUrl}</a>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#ffe5e5;padding:20px 40px;border-top:1px solid #ffb4ae;">
                    <p style="margin:0;color:#111111;font-size:12px;text-align:center;line-height:1.6;">
                      Este link expira em <strong>24 horas</strong>. Se você não criou uma conta no Card0, ignore este e-mail.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
        attachments: [card0LogoAttachment],
    })
}

export async function sendPasswordResetEmail(
    toEmail: string,
    toName: string,
    code: string
) {
    await transporter.sendMail({
        from: `"Card0" <${fromEmail}>`,
        to: toEmail,
        subject: 'Código para redefinir sua senha – Card0',
        html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0;padding:0;background:#f3f3f3;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f3;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 12px 28px rgba(0,0,0,0.14);border:1px solid #ffe1de;">
                <tr>
                  <td style="background:#ffffff;padding:28px 40px 20px;text-align:center;border-top:5px solid #ff2b1d;">
                    <img src="cid:card0-logo" alt="Card0" width="132" style="display:block;margin:0 auto;max-width:132px;height:auto;" />
                    <p style="margin:14px 0 0;color:#ff2b1d;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Recuperação de senha</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 40px 32px;text-align:center;">
                    <h2 style="margin:0 0 16px;color:#111111;font-size:24px;font-weight:800;letter-spacing:-0.3px;">Olá, ${toName}!</h2>
                    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">
                      Use o código abaixo para redefinir sua senha no <strong>Card0</strong>.
                    </p>
                    <div style="display:inline-block;background:#ffe5e5;color:#111111;border:1px solid #ffb4ae;border-radius:14px;padding:16px 30px;font-size:32px;font-weight:900;letter-spacing:8px;box-shadow:0 10px 22px rgba(255,43,29,0.12);">
                      ${code}
                    </div>
                    <p style="margin:28px 0 0;color:#777;font-size:13px;line-height:1.6;">
                      Este código expira em <strong>15 minutos</strong>. Se você não solicitou a recuperação de senha, ignore este e-mail.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#ffe5e5;padding:18px 40px;border-top:1px solid #ffb4ae;">
                    <p style="margin:0;color:#111111;font-size:12px;text-align:center;line-height:1.6;">
                      Nunca compartilhe este código. A equipe Card0 não solicita códigos por telefone ou mensagem.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
        attachments: [card0LogoAttachment],
    })
}
