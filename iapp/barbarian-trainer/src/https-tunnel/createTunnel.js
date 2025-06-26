import ngrok from "@ngrok/ngrok";

/**
 * Creates an ngrok tunnel to expose a local port to the internet.
 *
 * @async
 * @function createTunnel
 * @param {Object} params - Configuration params.
 * @param {number} [params.port=8080] - The local port to expose.
 * @param {string} params.authtoken - The ngrok authentication token.
 * @returns {Promise<string>} The public URL of the created tunnel.
 */
export const createTunnel = async ({ port = 8080, authtoken }) => {
  // Establish connectivity
  const listener = await ngrok.forward({
    addr: port,
    authtoken,
  });
  const url = listener.url();
  // Output ngrok url to console
  console.log(`Port ${port} forwarded to ${url}`);
  return url;
};
