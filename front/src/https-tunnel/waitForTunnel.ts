import { WebSocketProvider } from "ethers";

export const waitForTunnel = async (gossipAddress: string): Promise<string> => {
  const provider = new WebSocketProvider("wss://bellecour.iex.ec");

  return new Promise((resolve, reject) => {
    const cleanup = () => provider.removeAllListeners(["block", "error"]);
    provider.on("error", () => {
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
              const utf8Data = Buffer.from(tx.data.slice(2), "hex").toString(
                "utf8"
              );
              const { url } = JSON.parse(utf8Data);
              cleanup();
              resolve(url);
            } catch (e) {
              console.error(e);
              // noop
            }
          }
        });
      });
    });
  });
};

// test
// (async () => {
//   console.log(
//     await waitForTunnel("0xCA302f663d7E4F9D4eFD6B57A0586c9c39ED0033")
//   );
// })();
