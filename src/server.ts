import { Server } from "http";
import { app } from "./app";
import { bucketExists, createFlagBuckets } from "./fs";

let server: Server;

function startServer() {
  server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port", process.env.PORT || 3000);
    if (!bucketExists()) createFlagBuckets();
  });
}

export { server, startServer };
