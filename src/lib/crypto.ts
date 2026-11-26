import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const rawSecret = process.env.ENCRYPTION_SECRET_KEY;
  if (!rawSecret || rawSecret.trim().length < 16) {
    throw new Error(
      "Thiếu hoặc không hợp lệ biến môi trường ENCRYPTION_SECRET_KEY."
    );
  }

  const trimmed = rawSecret.trim();
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }

  return createHash("sha256").update(trimmed, "utf8").digest();
}

/** Encrypt a JSON-serializable credentials object using AES-256-GCM. */
export function encryptJson<T extends object>(payload: T): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const plaintext = JSON.stringify(payload);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/** Decrypt an AES-256-GCM payload produced by encryptJson back into its typed object. */
export function decryptJson<T>(cipherText: string): T {
  const parts = cipherText.split(":");
  if (parts.length !== 3) {
    throw new Error("Dữ liệu mã hóa không đúng định dạng.");
  }

  const [ivHex, tagHex, dataHex] = parts;
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error("Dữ liệu mã hóa bị thiếu thành phần.");
  }

  const key = getEncryptionKey();
  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8")) as T;
}
