import { JsonRpcProvider, Wallet } from "ethers";
import NodeRSA from "node-rsa";

const encryptRsaToHex = ({ data, publicPemBase64 }) => {
  const key = new NodeRSA().importKey(
    Buffer.from(publicPemBase64, "base64").toString("utf8")
  );
  return `0x${key.encrypt(data).toString("hex")}`;
};

export const gossipUrl = async ({ url, gossipPrivateKey, publicPemBase64 }) => {
  try {
    const gossipWallet = new Wallet(
      gossipPrivateKey,
      new JsonRpcProvider("https://bellecour.iex.ec")
    );
    const tx = await gossipWallet.sendTransaction({
      to: gossipWallet.address,
      data: encryptRsaToHex({ data: JSON.stringify({ url }), publicPemBase64 }),
    });
    console.log(`gossip url tx ${tx.hash}`);
    await tx.wait();
  } catch {
    throw Error("Failed to gossip url");
  }
};
