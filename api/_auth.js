const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function isAuthorized(req) {
  if (!ADMIN_PASSWORD) {
    console.warn("ADMIN_PASSWORD is not configured in environment variables.");
    return false;
  }

  const headerKey = req.headers["x-admin-key"];
  const authHeader = req.headers["authorization"];

  if (headerKey && headerKey === ADMIN_PASSWORD) {
    return true;
  }
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token === ADMIN_PASSWORD) return true;
  }
  return false;
}

export function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-admin-key, Authorization"
  );
}

export async function parseBody(req) {
  try {
    const raw = req.body;
    if (raw) {
      if (typeof raw === "object") return raw;
      if (typeof raw === "string") {
        try {
          return JSON.parse(raw);
        } catch {
          return {};
        }
      }
    }
  } catch (e) {
    // Vercel's req.body getter throws if payload is non-json or malformed
  }

  // Fallback: read raw chunks from request stream
  try {
    if (req && typeof req[Symbol.asyncIterator] === "function") {
      let data = "";
      for await (const chunk of req) {
        data += chunk;
      }
      if (data && data.trim()) {
        try {
          return JSON.parse(data);
        } catch {
          return {};
        }
      }
    }
  } catch (streamErr) {
    // Ignore stream read errors
  }

  return {};
}
