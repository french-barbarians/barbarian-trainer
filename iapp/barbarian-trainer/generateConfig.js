import { writeFileSync, readFileSync } from "node:fs";
import { config } from "dotenv";
import { Wallet } from "ethers";

config();
const { DEV_PRIVATE_KEY, NGROK_TOKEN } = process.env;
if (!DEV_PRIVATE_KEY) {
  throw Error("Missing DEV_PRIVATE_KEY in .env");
}
if (!NGROK_TOKEN) {
  throw Error("Missing NGROK_TOKEN in .env");
}

const { address, privateKey } = new Wallet(DEV_PRIVATE_KEY);

const conf = JSON.parse(readFileSync("iapp.config.template.json"));

writeFileSync(
  "iapp.config.json",
  JSON.stringify(
    {
      ...conf,
      walletAddress: address,
      walletPrivateKey: privateKey,
      appSecret: JSON.stringify({ NGROK_TOKEN }),
    },
    null,
    2
  )
);

console.log("Generated iapp.config.json with secrets from .env");
