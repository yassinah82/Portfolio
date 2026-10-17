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

export function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

