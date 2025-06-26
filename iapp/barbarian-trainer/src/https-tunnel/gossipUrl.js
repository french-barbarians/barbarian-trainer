import { JsonRpcProvider, Wallet } from "ethers";

export const gossipUrl = async ({ url, gossipPrivateKey }) => {
  try {
    const gossipWallet = new Wallet(
      gossipPrivateKey,
      new JsonRpcProvider("https://bellecour.iex.ec")
    );
    const tx = await gossipWallet.sendTransaction({
      to: gossipWallet.address,
      data: `0x${Buffer.from(JSON.stringify({ url })).toString("hex")}`,
    });
    console.log(`gossip url tx ${tx.hash}`);
    await tx.wait();
  } catch {
    throw Error("Failed to gossip url");
  }
};
