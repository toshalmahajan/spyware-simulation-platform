import CryptoJS from 'crypto-js';

// Encryption service for sensitive data
class EncryptionService {
  constructor() {
    // In production, these should come from environment variables or secure key management
    this.encryptionKey = CryptoJS.SHA256('spysim-secure-encryption-key-2024').toString();
    this.iv = CryptoJS.lib.WordArray.random(16);
  }
  
  // Encrypt data with AES
  encrypt(data) {
    try {
      if (typeof data === 'object') {
        data = JSON.stringify(data);
      }
      
      const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey, {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      return {
        encryptedData: encrypted.toString(),
        iv: this.iv.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }
  
  // Decrypt data
  decrypt(encryptedPackage) {
    try {
      const { encryptedData, iv } = encryptedPackage;
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Try to parse as JSON, return as string if it fails
      try {
        return JSON.parse(decryptedText);
      } catch {
        return decryptedText;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
  
  // Hash data (one-way)
  hash(data) {
    return CryptoJS.SHA256(data).toString();
  }
  
  // Generate secure random tokens
  generateToken(length = 32) {
    return CryptoJS.lib.WordArray.random(length).toString();
  }
  
  // Encrypt sensitive fields in an object
  encryptSensitiveFields(obj, sensitiveFields) {
    const encrypted = { ...obj };
    
    sensitiveFields.forEach(field => {
      if (encrypted[field]) {
        const encryptedField = this.encrypt(encrypted[field]);
        encrypted[field] = encryptedField.encryptedData;
        encrypted[`${field}_iv`] = encryptedField.iv;
        encrypted[`${field}_encrypted`] = true;
      }
    });
    
    return encrypted;
  }
  
  // Decrypt sensitive fields in an object
  decryptSensitiveFields(obj, sensitiveFields) {
    const decrypted = { ...obj };
    
    sensitiveFields.forEach(field => {
      if (decrypted[`${field}_encrypted`] && decrypted[field] && decrypted[`${field}_iv`]) {
        try {
          const encryptedPackage = {
            encryptedData: decrypted[field],
            iv: decrypted[`${field}_iv`]
          };
          decrypted[field] = this.decrypt(encryptedPackage);
          delete decrypted[`${field}_iv`];
          delete decrypted[`${field}_encrypted`];
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
        }
      }
    });
    
    return decrypted;
  }
}

// Create singleton instance
export const encryptionService = new EncryptionService();

// Export individual functions for convenience
export const encryptData = (data) => encryptionService.encrypt(data);
export const decryptData = (encryptedPackage) => encryptionService.decrypt(encryptedPackage);
export const hashData = (data) => encryptionService.hash(data);
export const generateSecureToken = (length) => encryptionService.generateToken(length);
