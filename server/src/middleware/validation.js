export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhone(phone) {
    const phoneRegex = /^(\+7|8)\d{10}$/;
    return phoneRegex.test(phone);
}
