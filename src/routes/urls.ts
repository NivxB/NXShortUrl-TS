import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getUrl, incrementHits, listUrls, saveUrl } from "../store.js";

const CreateBody = z.object({
	url: z.string().url(),
	slug: z.string().min(2).max(32).optional(),
});

export async function urlRoutes(app: FastifyInstance) {
	app.post("/urls", async (req, reply) => {
		const parsed = CreateBody.safeParse(req.body);
		if (!parsed.success) {
			return reply.status(400).send({ error: parsed.error.flatten() });
		}

		const { url, slug } = parsed.data;
		const finalSlug = slug ?? nanoid(7);

		if (slug && getUrl(slug)) {
			return reply.status(409).send({ error: "Slug already in use" });
		}

		const entry = saveUrl(finalSlug, url);
		return reply.status(201).send({ slug: finalSlug, ...entry });
	});

	app.get("/:slug", async (req, reply) => {
		const { slug } = req.params as { slug: string };
		const entry = getUrl(slug);

		if (!entry) {
			return reply.status(404).send({ error: "Not found" });
		}

		incrementHits(slug);
		return reply.redirect(entry.originalUrl, 302);
	});

	app.get("/urls", async (_req, reply) => {
		return reply.send(listUrls());
	});

	app.get("/urls/:slug/stats", async (req, reply) => {
		const { slug } = req.params as { slug: string };
		const entry = getUrl(slug);

		if (!entry) {
			return reply.status(404).send({ error: "Not found" });
		}

		return reply.send({ slug, ...entry });
	});
}
