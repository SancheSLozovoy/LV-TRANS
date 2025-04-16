export function getMailTemplate(resetUrl) {
  return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #7A6759; border: 1px solid #ddd;color: #FFFFFF">
            <h2>Сброс пароля для LV-TRANS</h2>
            <p>Здравствуйте!</p>
            <p>Вы запросили сброс пароля. Чтобы задать новый пароль, нажмите на кнопку ниже:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="padding: 12px 24px; background-color: #E4B437; color: #7A6759; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    Сбросить пароль
                </a>
            </div>
            <p style="font-size: 14px;">Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
            <hr style="margin: 40px 0;">
            <p style="font-size: 12px;">LV-TRANS — служба поддержки. Не отвечайте на это письмо.</p>
        </div>
    `;
}
