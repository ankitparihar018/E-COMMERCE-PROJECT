export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
};

export const isValidPassword = (password) => {
    return typeof password === "string" && password.length >= 6;
};