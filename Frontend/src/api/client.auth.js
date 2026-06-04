import { requestJson } from "./client.js";
import { tokenStore } from "../state/auth_store.js";

export async function requestWithAuthRetry(args) {
    let res = await requestJson({ ...args, auth: true });
    if (res.ok) return res;

    if (res.error?.status === 401 && res.error?.code === "TOKEN_EXPIRED") {
        const refreshRes = await requestJson({ method: "POST", path: "/auth/refresh" });
        if (refreshRes.ok) {
            tokenStore.set(refreshRes.data.accessToken);
            res = await requestJson({ ...args, auth: true });
            return res;
        }
    }
    return res;
}
export async function GetMe(){
    return await requestWithAuthRetry({method: "GET", path: "/auth/me"});
}
export async function Logout(){
    const res = await requestWithAuthRetry({method: "POST", path: "/auth/logout"});
    if (res.ok) tokenStore.clear();
    return res;
}

export async function Login(dto){
    const res = await requestJson({method: "POST", path: "/auth/login", body: dto});
    if (res.ok) tokenStore.set(res.data.accessToken);
    return res;
}
export async function Register(dto){
    return await requestJson({method: "POST", path: "/auth/registration", body: dto, auth: false});
}
export async function Refresh(){
    return await requestJson({method: "POST", path: "/auth/refresh", auth: false});
}
export async function GetMyProfile(){
    return await requestWithAuthRetry({method: "GET", path: "/auth/me/profile"})
}