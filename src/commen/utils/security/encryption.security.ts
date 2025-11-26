import CryptoJS from "crypto-js";

export const generateEncryption = async (
  plainText: string,
  secretKey: string = process.env.ENCRYPTION_SECRET_KEY || ""
): Promise<string> => {
  return CryptoJS.AES.encrypt(plainText, secretKey).toString();
};

export const decryptEncryption = async (
  cipherText: string,
  secretKey: string = process.env.ENCRYPTION_SECRET_KEY || ""
): Promise<string> => {
  return CryptoJS.AES.decrypt(cipherText, secretKey).toString(
    CryptoJS.enc.Utf8
  );
};
