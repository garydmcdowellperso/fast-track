import fp from "fastify-plugin";
import Pusher from "pusher";
import config from "../config";
const pushPlugin = fp(async fastify => {
  const pusher = new Pusher({
    appId: config.push.appId,
    key: config.push.key,
    secret: config.push.secret,
    cluster: "eu",
    useTLS: true
  });
  /*
  const wss = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024 // Size (in bytes) below which messages
      // should not be compressed if context takeover is disabled.
    }
  });
   const clients = new Map();
   wss.on('connection', (ws) => {
    console.log('ws', ws)
    /*
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
     clients.set(ws, metadata);
    
  });
   wss.on("close", () => {
    /*
    clients.delete(ws);
  });
  */

  fastify.decorate("trigger", async (message, uid) => {
    if (!pusher) {// Swallow
    }

    if (pusher) {
      await pusher.trigger("simpatico", "event", {
        message,
        uid
      });
    }
  });
});
export default pushPlugin;