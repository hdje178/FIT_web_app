export const tokenStore = (() => {
    let _accessToken = null;
    const set = (token) => {
        _accessToken = token;
    }
    const get = () => _accessToken;
    const clear = () => {
        _accessToken = null;
    }
    return { set, get, clear}
})();