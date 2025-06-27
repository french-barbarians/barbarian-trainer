import { WebSocketProvider } from "ethers";
import { decryptRsaFromHex } from "./crypto";

export const waitForTunnel = async ({
  gossipAddress,
  privatePemBase64,
}: {
  gossipAddress: string;
  privatePemBase64: string;
}): Promise<string> => {
  const provider = new WebSocketProvider("wss://bellecour.iex.ec");

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      provider.removeAllListeners("block");
      provider.removeAllListeners("error");
      provider.websocket.close();
    };
    provider.on("error", (e) => {
      console.log("err", e);
      cleanup();
      reject(Error("Fail to get https tunnel URL"));
    });
    provider.on("block", async (blockNumber) => {
      const block = await provider.getBlock(blockNumber);
      block?.transactions?.forEach((txHash) => {
        provider.getTransaction(txHash).then((tx) => {
          if (
            tx?.from?.toLowerCase() === gossipAddress.toLowerCase() &&
            tx?.to?.toLowerCase() === gossipAddress.toLowerCase()
          ) {
            try {
              const utf8Data = decryptRsaFromHex({
                encryptedHex: tx.data,
                privatePemBase64,
              });
              const { url } = JSON.parse(utf8Data);
              cleanup();
              resolve(url);
            } catch {
              // noop
            }
          }
        });
      });
    });
  });
};
