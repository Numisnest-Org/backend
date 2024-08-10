import http from "http";
import app from "./app.js";
import socketCh
        origin: "*",
    },
});

global.io = io;

await socketChat(io);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`server listening on: http://localhost:${PORT}/api`);
});

export default server;
