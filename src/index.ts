import Fastify from "fastify";
import { urlRoutes } from "./routes/urls.js";

const app = Fastify({ logger: true });

app.register(urlRoutes);

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

try {
	await app.listen({ port: PORT, host: HOST });
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
