export const passwordRequirementText = 'Password minimal 8 karakter dan wajib mengandung huruf besar, angka, serta karakter spesial.'

export const phoneRequirementText = 'No. HP harus berupa angka saja dengan panjang 11 sampai 12 digit.'

export const emailRequirementText = 'Email harus valid dan wajib mengandung karakter @.'

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongPassword(password: string): boolean {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
}

export function isValidPhoneNumber(phone: string): boolean {
  return /^\d{11,12}$/.test(phone)
}

export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '')
}
