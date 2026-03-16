// FUNCTION FOR LOCAL STORAGE
export const STORAGE_KEY = "lr1_items";

export function saveToLocalStorage(state){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}
export function loadFromLocalStorage(STORAGE_KEY) {
    const json =localStorage.getItem(STORAGE_KEY);
    if (json ===null){
        return [];
    }
    try {
        const data = JSON.parse(json);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}