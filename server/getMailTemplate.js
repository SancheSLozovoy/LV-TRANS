export function getMailTemplate(resetUrl) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <tr>
        <td bgcolor="#7A6759" style="padding: 30px 0; text-align: center;">
          <img src="https://i.ibb.co/wZrmpHGf/logo.png" alt="LV-TRANS Logo" width="180" style="display: block; margin: 0 auto;">
        </td>
      </tr>
      
      <tr>
        <td bgcolor="#F5F5F5" style="padding: 40px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color: #333333; font-size: 24px; font-weight: bold; padding-bottom: 20px;">
                Сброс пароля
              </td>
            </tr>
            <tr>
              <td style="color: #555555; font-size: 16px; line-height: 1.5; padding-bottom: 10px;">
                Здравствуйте!
              </td>
            </tr>
            <tr>
              <td style="color: #555555; font-size: 16px; line-height: 1.5; padding-bottom: 30px;">
                Вы запросили сброс пароля для вашего аккаунта LV-TRANS. Для установки нового пароля нажмите кнопку ниже:
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 40px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" bgcolor="#E4B437" style="border-radius: 6px;">
                      <a href="${resetUrl}" 
                         style="display: inline-block; padding: 15px 30px; color: #7A6759; text-decoration: none; font-size: 16px; font-weight: bold;">
                        Сбросить пароль
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="color: #888888; font-size: 14px; line-height: 1.5; padding-bottom: 20px; text-align: center">
                Ссылка действительна в течение 30 минут. Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <tr>
        <td bgcolor="#e6e6e6" style="padding: 20px 30px; text-align: center;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="color: #999999; font-size: 12px; line-height: 1.5;">
                © ${new Date().getFullYear()} LV-TRANS. Все права защищены.
              </td>
            </tr>
            <tr>
              <td style="color: #999999; font-size: 12px; line-height: 1.5; padding-top: 10px;">
                Это автоматическое письмо. Пожалуйста, не отвечайте на него.
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px;">
                <a href="https://lv-trans.com" style="color: #7A6759; text-decoration: none; font-size: 12px;">
                  Наш сайт
                </a> | 
                <a href="https://lv-trans.com/#contact" style="color: #7A6759; text-decoration: none; font-size: 12px;">
                  Контакты
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
