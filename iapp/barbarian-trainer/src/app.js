import { IExecDataProtectorDeserializer } from "@iexec/dataprotector-deserializer";
import fs from "node:fs/promises";
import { createTunnel } from "./https-tunnel/createTunnel.js";
import { gossipUrl } from "./https-tunnel/gossipUrl.js";
import { sleep } from "./utils/sleep.js";

const AGENT_PORT = 11434;

const main = async () => {
  const { IEXEC_OUT } = process.env;

  let computedJsonObj = {};

  try {
    let NGROK_TOKEN;
    let GOSSIP_PRIVATE_KEY;
    try {
      console.log("Loading app secrets...");
      const { IEXEC_APP_DEVELOPER_SECRET } = process.env;
      ({ NGROK_TOKEN, GOSSIP_PRIVATE_KEY } = JSON.parse(
        IEXEC_APP_DEVELOPER_SECRET
      ));

      console.log("App secrets loaded");
    } catch {
      throw Error("Failed to lod app secrets");
    }

    // TODO load users data
    try {
      const deserializer = new IExecDataProtectorDeserializer();
      // The protected data mock created for the purpose of this Hello World journey
      // contains an object with a key "secretText" which is a string
      const protectedName = await deserializer.getValue("secretText", "string");
      console.log("Found a protected data");
    } catch (e) {
      console.log("It seems there is an issue with your protected data:", e);
    }

    const { IEXEC_REQUESTER_SECRET_1, IEXEC_REQUESTER_SECRET_42 } = process.env;
    if (IEXEC_REQUESTER_SECRET_1) {
      const redactedRequesterSecret = IEXEC_REQUESTER_SECRET_1.replace(
        /./g,
        "*"
      );
      console.log(`Got requester secret 1 (${redactedRequesterSecret})!`);
    } else {
      console.log(`Requester secret 1 is not set`);
    }
    if (IEXEC_REQUESTER_SECRET_42) {
      const redactedRequesterSecret = IEXEC_REQUESTER_SECRET_42.replace(
        /./g,
        "*"
      );
      console.log(`Got requester secret 42 (${redactedRequesterSecret})!`);
    } else {
      console.log(`Requester secret 42 is not set`);
    }

    // send user data to agent

    const requestBody = {
      model: "thewhitewizard/teddy:3b",
      messages: [
        {
          role: "system",
          content:
            "Tu vas recevoir les données d'entraînement de l'utilisateur. Analyse-les et garde-les en mémoire pour les prochaines questions.",
        },
        {
          role: "user",
          content: "trail 16km 300m D+ en 1h42",
        },
        {
          role: "assistant",
          content:
            "J'ai bien reçu et analysé tes données d'entraînement. Je les garde en mémoire pour personnaliser mes conseils. Tu peux maintenant me poser tes questions sur ton plan d'entraînement.",
        },
      ],
      stream: false,
      options: {
        temperature: 0.1, // Très factuelle pour le contexte
        num_predict: 50, // Réponse courte
      },
    };

    const response = await fetch(`http://localhost:${AGENT_PORT}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then((res) => res?.json());
    console.log(`Agent response: ${JSON.stringify(response, null, 2)}`);

    // Create https tunnel
    const tunnelUrl = await createTunnel({
      port: 11434,
      authtoken: NGROK_TOKEN,
    });
    // gossip tunnel URL
    await gossipUrl({ gossipPrivateKey: GOSSIP_PRIVATE_KEY, url: tunnelUrl });

    // Write result to IEXEC_OUT
    await fs.writeFile(
      `${IEXEC_OUT}/result.json`,
      JSON.stringify({
        ok: true,
      })
    );

    // Build the "computed.json" object
    computedJsonObj = {
      "deterministic-output-path": `${IEXEC_OUT}/result.json`,
    };
    await fs.writeFile(
      `${IEXEC_OUT}/computed.json`,
      JSON.stringify(computedJsonObj)
    );

    console.log("Tunnel open");
    await sleep(50 * 60000);
  } catch (e) {
    // Handle errors
    console.log(e);

    // Build the "computed.json" object with an error message
    computedJsonObj = {
      "deterministic-output-path": IEXEC_OUT,
      "error-message": "Oops something went wrong",
    };
  } finally {
    // Save the "computed.json" file
    await fs.writeFile(
      `${IEXEC_OUT}/computed.json`,
      JSON.stringify(computedJsonObj)
    );
  }
};

main();
