interface VerifyEmailTemplateProps {
  userName: string;
  verificationLink: string;
}

export function VerifyEmailTemplate({
  userName,
  verificationLink,
}: VerifyEmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تحقق من بريدك الإلكتروني</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      قبيلة آل العبد الحباب
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; text-align: right;">
                      مرحباً ${userName}،
                    </h2>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: right;">
                      شكراً لتسجيلك في موقع قبيلة آل العبد الحباب. للتحقق من حسابك وتفعيله، يرجى الضغط على الزر أدناه:
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${verificationLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                            تحقق من بريدك الإلكتروني
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6; text-align: right;">
                      أو انسخ الرابط التالي والصقه في متصفحك:
                    </p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-right: 4px solid #667eea; margin: 20px 0; word-break: break-all;">
                      <a href="${verificationLink}" style="color: #667eea; text-decoration: none; font-size: 14px;">
                        ${verificationLink}
                      </a>
                    </div>

                    <p style="margin: 30px 0 0 0; color: #999999; font-size: 14px; line-height: 1.6; text-align: right;">
                      <strong>ملاحظة:</strong> هذا الرابط صالح لمدة 24 ساعة فقط. إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد الإلكتروني.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                      © 2026 قبيلة آل العبد الحباب. جميع الحقوق محفوظة.
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      إذا كان لديك أي استفسار، يرجى التواصل معنا على support@alabd-family.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

interface ResetPasswordTemplateProps {
  userName: string;
  resetLink: string;
}

export function resetPasswordTemplate({
  userName,
  resetLink,
}: ResetPasswordTemplateProps) {
  return `
<!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>إعادة تعيين كلمة المرور</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #d4af37 0%, #424242 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      قبيلة آل العبد الحباب
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; text-align: right;">
                      مرحباً ${userName}،
                    </h2>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6; text-align: right;">
                      لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. للمتابعة، يرجى الضغط على الزر أدناه:
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetLink}" style="display: inline-block; padding: 16px 40px; background: #d4af37 ; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
                            إعادة تعيين كلمة المرور
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6; text-align: right;">
                      أو انسخ الرابط التالي والصقه في متصفحك:
                    </p>
                    <div style="background-color: #43A6C6; padding: 15px; border-radius: 6px; border-right: 4px solid #f5576c; margin: 20px 0; word-break: break-all;">
                      <a href="${resetLink}" style="color: #43A6C6; text-decoration: none; font-size: 14px;">
                        ${resetLink}
                      </a>
                    </div>

                    <!-- Warning Box -->
                    <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin: 30px 0;">
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6; text-align: right;">
                        <strong>تنبيه :</strong> هذا الرابط صالح لمدة نصف ساعة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد وحسابك سيبقى آمناً.
                      </p>
                    </div>

                    <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px; line-height: 1.6; text-align: right;">
                      إذا كنت تواجه مشكلة في إعادة تعيين كلمة المرور، يرجى التواصل مع فريق الدعم.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                      © 2026 قبيلة آل العبد الحباب. جميع الحقوق محفوظة.
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      إذا كان لديك أي استفسار، يرجى التواصل معنا على <a href="mailto:alalabd505@gmail.com" style="color: #43A6C6">alalabd505@gmail.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
