import {requestJson} from "./client.js";

export async function getItems(q, signal){
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    return requestJson({method: "GET", path: `/${qs}`, signal});
}
export async function createItem(dto, signal){
    return requestJson({method: "POST", path: "/", body: dto, signal})
}
export function updateItemPut(id, dto) {
    return requestJson({
        method: "PUT",
        path: `/${encodeURIComponent(id)}`,
        body: dto,
    });
}
export function updateItemPatch(id, dto) {
    return requestJson({
        method: "PATCH",
        path: `/${encodeURIComponent(id)}`,
        body: dto,
    });
}

export function deleteItem(id) {
    return requestJson({
        method: "DELETE",
        path: `/${encodeURIComponent(id)}`,
    });
}