import {requestJson} from "./client.js";
import {requestWithAuthRetry} from "./client.auth.js";
let cache = {};

export async function getEvents(q, signal){
    const qs = new URLSearchParams(q).toString();
    const path = qs ? `/events?${qs}` : "/events";
    if(cache[qs]){
        console.log("Взято з кешу", qs);
        return cache[qs];
    }
    console.log("Відбувся запит до серверу");
    const data = await requestJson({method: "GET", path, signal});
    cache[qs] = data;
    return data;
}

export async function createEvents(dto, signal){
    const data = await requestWithAuthRetry({ method: "POST", path: "/events", body: dto, signal });
    cache = {};
    return data;
}

export async function updateEventsPut(id, dto){
    const data = await requestWithAuthRetry({
        method: "PUT",
        path: `/events/${encodeURIComponent(id)}`,
        body: dto,
    });
    cache = {};
    return data;
}

export async function updateEventsPatch(id, dto){
    const data = await requestWithAuthRetry({
        method: "PATCH",
        path: `/events/${encodeURIComponent(id)}`,
        body: dto,
    });
    cache = {};
    return data;
}

export async function deleteEvent(id){
    const data = await requestWithAuthRetry({
        method: "DELETE",
        path: `/events/${encodeURIComponent(id)}`,
    });
    cache = {};
    return data;
}