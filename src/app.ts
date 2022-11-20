import express from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import fs from "fs";

const app = express();
let flags: { [key: string]: string | boolean | number } = {};

app.use(json());
dotenv.config();

app.listen(process.env.PORT || 3000, () =>
  console.log("Listening on port 3000")
);

app.get("/flags.json", (req, res) => {
  res.json(flags);
});

async function getFlags() {
  const retrievedFlags = await fs.promises.readFile(
    "./src/flags.json",
    "utf-8"
  );
  const parsedFlags = JSON.parse(retrievedFlags);

  return parsedFlags;
}

async function main() {
  fs.watchFile("./src/flags.json", async () => {
    flags = await getFlags();
  });

  flags = await getFlags();
}

main();

export { app };
