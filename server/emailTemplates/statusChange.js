export function statusChange(orderId, statusName) {
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
                                Изменение статуса заказа
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #555555; font-size: 16px; line-height: 1.5; padding-bottom: 10px;">
                                Здравствуйте!
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #555555; font-size: 16px; line-height: 1.5; padding-bottom: 30px;">
                                Ваш заказ №${orderId} изменил свой статус на "${statusName}".
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #555555; font-size: 16px; line-height: 1.5; padding-bottom: 20px;">
                                Если у вас есть вопросы, не стесняйтесь обращаться в службу поддержки.
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #888888; font-size: 14px; line-height: 1.5; padding-bottom: 20px; text-align: center">
                                Спасибо, что выбрали LV-TRANS!
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
                                <a href="https://lv-trans-app.ru" style="color: #7A6759; text-decoration: none; font-size: 12px;">
                                    Наш сайт
                                </a> | 
                                <a href="https://lv-trans-app.ru/#contact" style="color: #7A6759; text-decoration: none; font-size: 12px;">
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
