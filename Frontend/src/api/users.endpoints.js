import {requestWithAuthRetry} from "./client.auth.js";

export async function getUsers(q, signal){
    const qs = new URLSearchParams(q).toString();
    const path = qs ? `/users?${qs}` : "/users";
    return requestWithAuthRetry({method: "GET", path, signal});
}
export async function createUsers(dto, signal){
    return requestWithAuthRetry({method: "POST", path: "/users", body: dto, signal})
}
export function updateUserPut(id, dto) {
    return requestWithAuthRetry({
        method: "PUT",
        path: `/users/${encodeURIComponent(id)}`,
        body: dto,
    });
}
export function updateUserPatch(id, dto) {
    return requestWithAuthRetry({
        method: "PATCH",
        path: `/users/${encodeURIComponent(id)}`,
        body: dto,
    })
}
export function deleteUser(id) {
    return requestWithAuthRetry({
        method: "DELETE",
        path: `/users/${encodeURIComponent(id)}`,
    })
}
export function getUser(id) {
    return requestWithAuthRetry({
        method: "GET",
        path: `/users/${encodeURIComponent(id)}`,
    })
}