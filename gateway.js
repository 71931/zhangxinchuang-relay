// gateway.js —— 一个域名同时对外提供 server 与 mcp
// /mcp /sse /messages* → MCP(内部 8787)；其余（/api /health /upload …）→ server(内部 8513)
import http from "node:http";

const PORT = Number(process.env.PORT || 10000);
const MCP_PORT = Number(process.env.MCP_INTERNAL_PORT || 8787);
const SERVER_PORT = Number(process.env.SERVER_INTERNAL_PORT || 8513);
const MCP_PATHS = ["/mcp", "/sse", "/messages", "/message"];

function pickPort(rawUrl) {
  const path = String(rawUrl || "/").split("?")[0];
  for (const p of MCP_PATHS) {
    if (path === p || path.startsWith(p + "/")) return MCP_PORT;
  }
  return SERVER_PORT;
}

function proxy(req, res, port) {
  const up = http.request(
    { host: "127.0.0.1", port, path: req.url, method: req.method, headers: req.headers },
    (ur) => {
      res.writeHead(ur.statusCode || 502, ur.headers);
      ur.pipe(res);
    }
  );
  up.on("error", () => {
    try {
      res.writeHead(502, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, err: "upstream " + port + " not ready" }));
    } catch {}
  });
  req.pipe(up);
}

http.createServer((req, res) => proxy(req, res, pickPort(req.url))).listen(PORT, "0.0.0.0", () => {
  console.log("[gateway] listening on " + PORT + " | mcp:" + MCP_PORT + " server:" + SERVER_PORT);
});
