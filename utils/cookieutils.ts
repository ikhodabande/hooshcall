import Cookies from "js-cookie"
import CryptoJS from "crypto-js"

const SECRET_KEY = "your-secret-key" 

const cookieUtils = {
  /**
   * Set a SHA-256 hashed cookie value
   * @param key - The cookie name
   * @param value - The raw value to hash and store
   * @param options - Cookie options (e.g., { expires: 7 })
   */
  setHashedCookie(key: string, value: string, options: any = { expires: 7 }): void {
    const hashedValue = CryptoJS.SHA256(value).toString()
    Cookies.set(key, hashedValue, options)
  },

  /**
   * Validate a hashed cookie value
   * @param key - The cookie name
   * @param originalValue - The original value to compare against the hashed one
   * @returns True if the hash matches the cookie
   */
  validateHashedCookie(key: string, originalValue: string): boolean {
    const hashedFromCookie = Cookies.get(key)
    const hashedOriginal = CryptoJS.SHA256(originalValue).toString()
    return hashedFromCookie === hashedOriginal
  },

  /**
   * Set an AES-encrypted cookie value
   * @param key - The cookie name
   * @param value - The raw value to encrypt and store
   * @param options - Cookie options (e.g., { expires: 7 })
   */
  setEncryptedCookie(key: string, value: string, options: any = { expires: 7 }): void {
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString()
    Cookies.set(key, encryptedValue, options)
  },

  /**
   * Get and decrypt an AES-encrypted cookie value
   * @param key - The cookie name
   * @returns The decrypted value as string, or null on failure
   */
  getDecryptedCookie(key: string): string | null {
    const encryptedValue = Cookies.get(key)
    if (!encryptedValue) return null

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return decrypted || null
    } catch (error) {
      console.error("Failed to decrypt cookie:", error)
      return null
    }
  },
}

export default cookieUtils
