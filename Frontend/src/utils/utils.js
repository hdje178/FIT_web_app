export function toISO(uiDate) {
    const [dd, mm, yyyy] = uiDate.split(".").map(Number);

    const d = new Date(Date.UTC(yyyy, mm - 1, dd));

    const valid =
        d.getUTCFullYear() === yyyy &&
        d.getUTCMonth() === mm - 1 &&
        d.getUTCDate() === dd;

    if (!valid) return null;

    return d.toISOString();
}
export function toYMD(uiDate) { // "dd.MM.yyyy" -> "yyyy-MM-dd"
    const [dd, mm, yyyy] = uiDate.split(".").map(Number);
    const d = new Date(Date.UTC(yyyy, mm - 1, dd));
    const valid =
        d.getUTCFullYear() === yyyy &&
        d.getUTCMonth() === mm - 1 &&
        d.getUTCDate() === dd;
    if (!valid) return null;
    const MM = String(mm).padStart(2, "0");
    const DD = String(dd).padStart(2, "0");
    return `${yyyy}-${MM}-${DD}`;
}
export function runAnimationAlert(store, text) {
    const toolbox = document.querySelector(".toolbox");
    const bar_fill = document.querySelector(".bar-fill");

    toolbox.classList.remove("show");
    bar_fill.classList.remove("run");

    const textNode = toolbox.querySelector(".text");
    textNode.textContent = text;

    void toolbox.offsetWidth;
    void bar_fill.offsetWidth;

    toolbox.classList.add("show");
    bar_fill.classList.add("run");
}