const API_BASE = "http://localhost:3000/api"

async function tryReadJson(res) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}
export async function requestJson({ method, path, body, signal }) {
    const url = `${API_BASE}${path}`;

    const init = { method, signal, headers: {} };

    if (body !== undefined) {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
    }

    let res;
    try {
        res = await fetch(url, init);
    } catch (e) {
        if (e.name === "AbortError") {
            return {
                ok: false,
                error: { kind: "abort", message: "Request cancelled" },
            };
        }
        return {
            ok: false,
            error: { kind: "network", message: "Network error" },
        };
    }

    if (!res.ok) {
        const details = await tryReadJson(res);
        return {
            ok: false,
            error: {
                kind: "http",
                status: res.status,
                message: `HTTP ${res.status}`,
                details,
            },
        };
    }

    if (res.status === 204) {
        return { ok: true, data: null };
    }

    try {
        const data = await res.json();
        return { ok: true, data };
    } catch {
        return {
            ok: false,
            error: { kind: "parse", message: "Failed to parse JSON" },
        };
    }
}

