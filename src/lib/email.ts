import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function sendVerificationEmail(
    toEmail: string,
    toName: string,
    token: string
) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`

    await transporter.sendMail({
        from: `"Card0" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Verifique seu e-mail – Card0',
        html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:#FF6600;padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Card0</h1>
                    <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">by Edenred</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px 40px 32px;">
                    <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;">Olá, ${toName}!</h2>
                    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                      Obrigado por se cadastrar no <strong>Card0</strong>. Para ativar sua conta, clique no botão abaixo para verificar seu e-mail.
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                      <tr>
                        <td style="background:#FF6600;border-radius:8px;text-align:center;">
                          <a href="${verifyUrl}"
                            style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.2px;">
                            Verificar e-mail
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 8px;color:#888;font-size:13px;">
                      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                    </p>
                    <p style="margin:0;word-break:break-all;">
                      <a href="${verifyUrl}" style="color:#FF6600;font-size:12px;">${verifyUrl}</a>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #efefef;">
                    <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
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
    })
}