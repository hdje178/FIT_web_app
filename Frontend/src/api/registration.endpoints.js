import {requestWithAuthRetry} from "./client.auth.js";

export async function getMyRegistration(signal){
    return await requestWithAuthRetry({method: "GET", path: "/registrations/me", signal});
}

export async function getRegistrations(signal){
    return await requestWithAuthRetry({method: "GET", path: "/registrations", signal});
}

export async function getRegistrationById(id, signal){
    return await requestWithAuthRetry({method: "GET", path: `/registrations/${id}`, signal});
}

export async function addRegistrations(dto, signal){
    return await requestWithAuthRetry({method: "POST", path: "/registrations", body: dto, signal});
}

export async function updateRegistrationPatch(id, dto, signal){
    return await requestWithAuthRetry({method: "PATCH", path: `/registrations/${id}`, body: dto, signal});
}

export async function updateRegistrationPut(id, dto, signal){
    return await requestWithAuthRetry({method: "PUT", path: `/registrations/${id}`, body: dto, signal});
}

export async function deleteRegistration(id, signal){
    return await requestWithAuthRetry({method: "DELETE", path: `/registrations/${id}`, signal});
}