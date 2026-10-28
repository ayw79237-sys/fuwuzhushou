import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";
import { createVoiceHandler } from "../lib/voice-router.mjs";
import { createRecordsHandler } from "../lib/records-router.mjs";
import { siteAssets } from "./site-assets";

const voiceHandler = createVoiceHandler();
const recordsHandler = createRecordsHandler();
const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    const recordsResponse = await recordsHandler(request, env);
    if (recordsResponse) return recordsResponse;
    const apiResponse = await voiceHandler(request, env);
    if (apiResponse) return apiResponse;
    const pathname = new URL(request.url).pathname;
    if (request.method === "GET" || request.method === "HEAD") {
      const asset = siteAssets[pathname === "/" ? "/index.html" : pathname];
      if (asset) return new Response(request.method === "HEAD" ? null : asset.body, {
        headers: { "content-type": asset.type, "x-content-type-options": "nosniff", "cache-control": "no-cache" },
      });
    }
    let binding = ctx.props?.CONNECTORS;
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() { return Date.now() >= expiresAt ? { status: "request_context_expired" } : preview.getContext?.() ?? { status: "binding_unavailable" }; },
        async invoke(connectorId, actionName, args) { return Date.now() >= expiresAt ? { status: "request_context_expired", message: "This request has expired. Please try again." } : preview.invoke(connectorId, actionName, args); },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
};
export default worker;
