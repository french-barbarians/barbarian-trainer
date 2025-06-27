import NodeRSA from "node-rsa";

export const generateKeyPairBase64 = () => {
  const key = new NodeRSA();
  key.generateKeyPair();
  return {
    publicPemBase64: Buffer.from(key.exportKey("public")).toString("base64"), // workaround TDX SMS issues
    privatePemBase64: Buffer.from(key.exportKey("private")).toString("base64"), // workaround TDX SMS issues
  };
};

export const decryptRsaFromHex = ({
  encryptedHex,
  privatePemBase64,
}: {
  encryptedHex: string;
  privatePemBase64: string;
}) => {
  const key = new NodeRSA().importKey(
    Buffer.from(privatePemBase64, "base64").toString("utf8")
  );
  return key
    .decrypt(Buffer.from(encryptedHex.substring(2), "hex"))
    .toString("utf8");
};

export const encryptRsaToHex = ({
  data,
  publicPemBase64,
}: {
  data: string;
  publicPemBase64: string;
}) => {
  const key = new NodeRSA().importKey(
    Buffer.from(publicPemBase64, "base64").toString("utf8")
  );
  return `0x${key.encrypt(data).toString("hex")}`;
};
