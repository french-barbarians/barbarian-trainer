import {
  decryptRsaFromHex,
  encryptRsaToHex,
  generateKeyPairBase64,
} from "./crypto";

const { privatePemBase64, publicPemBase64 } = generateKeyPairBase64();
console.log("🚀 ~ privatePemBase64:", privatePemBase64);
console.log("🚀 ~ publicPemBase64:", publicPemBase64);
const encryptedHex = encryptRsaToHex({
  data: JSON.stringify({ foo: "bar" }),
  publicPemBase64,
});
console.log("🚀 ~ encrypted:", encryptedHex);

const decrypted = decryptRsaFromHex({
  encryptedHex,
  privatePemBase64,
});
console.log("🚀 ~ decrypted:", decrypted);
