import { waitForTunnel } from "./waitForTunnel";

(async () => {
  console.log(
    await waitForTunnel("0xCA302f663d7E4F9D4eFD6B57A0586c9c39ED0033")
  );
})();
