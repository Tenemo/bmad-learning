import { createApp } from "./app.js";

async function main() {
  const app = createApp({ logger: true });
  const port = Number(process.env.PORT ?? 3001);

  await app.listen({
    host: "0.0.0.0",
    port
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
