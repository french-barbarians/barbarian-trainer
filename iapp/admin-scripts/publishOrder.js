import { config } from "dotenv";
import { IExec, utils } from "iexec";

import { readFileSync } from "node:fs";

config({ path: "../barbarian-trainer/.env" });

const { DEV_PRIVATE_KEY } = process.env;
if (!DEV_PRIVATE_KEY) {
  throw Error("Missing DEV_PRIVATE_KEY in ../barbarian-trainer/.env");
}

const deployed = JSON.parse(
  readFileSync("../barbarian-trainer/cache/bellecour/deployments.json")
);

const app = deployed[0].appContractAddress;
console.log("🚀 ~ app:", app);

const signer = utils.getSignerFromPrivateKey("bellecour", DEV_PRIVATE_KEY);
const iexec = new IExec({ ethProvider: signer });

const orderhash = await iexec.order
  .createApporder({
    app,
    workerpoolrestrict: "tdx-labs.pools.iexec.eth",
    tag: ["tee", "scone"],
    volume: 100,
  })
  .then(iexec.order.signApporder)
  .then(iexec.order.publishApporder);
console.log("🚀 ~ orderhash:", orderhash);
