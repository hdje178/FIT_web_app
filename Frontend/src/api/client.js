import {tokenStore} from "../state/auth_store.js";

const API_BASE = "http://localhost:3000/api/v1"


async function tryReadJson(res) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}
export async function requestJson({ method, path, body, signal, auth = true }) {
    const url = `${API_BASE}${path}`;

    const init = { method, signal, headers: {}, credentials: "include" };

    if (body !== undefined) {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
    }
    if (auth) {
        const token = tokenStore.get()
        if (token) {
            init.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    let res;
    try {
        res = await fetch(url, init);
    } catch (e) {
        console.log("FETCH ERROR", e);
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
        if (res.status === 403 && details?.error?.message === "Invalid password or email") {
            return {
                ok: false,
                error: {
                    kind: "auth",
                    code: details?.error?.code,
                    status: res.status,
                    message: `HTTP ${res.status} ${res.statusText}`,
                    details: "Invalid password or email"
                },
            };
        }
        if (res.status === 409) {
            return {
                ok: false,
                error: {
                    kind: "conflict",
                    code: details?.error?.code,
                    status: res.status,
                    message: `HTTP ${res.status} ${res.statusText}`,
                    details,
                },
            };
        }
        return {
            ok: false,
            error: {
                kind: "http",
                status: res.status,
                code: details?.error?.code,
                message: `HTTP ${res.status} ${res.statusText}`,
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

