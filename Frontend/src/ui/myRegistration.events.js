export function bindMyRegistrationsEvents(store) {
    document.querySelector("header").addEventListener("click", async (e) => {
        if (e.target.id === "logout") await store.logout();
    });

    const tbody = document.querySelector(".register_table_body");
    tbody.addEventListener("click", async (e) => {
        const btn = e.target.closest(".cancel-btn");
        if (!btn) return;

        btn.disabled = true;
        btn.textContent = 'Скасування...';

        const ok = await store.deleteRegistration(Number(btn.dataset.id));
        if (!ok) {
            btn.disabled = false;
            btn.textContent = 'Скасувати';
        }
    });

    store.subscribe((state) => {
        const spinner = document.querySelector(".spinner");
        const wrapper = document.querySelector(".spinner-wrapper");
        if (state.registration.isLoading || state.auth.isLoading) {
            spinner.classList.remove("hidden");
            wrapper.classList.remove("hidden");
            wrapper.style.pointerEvents = 'auto';
        } else {
            spinner.classList.add("hidden");
            wrapper.classList.add("hidden");
            wrapper.style.pointerEvents = 'none';
        }
    });
}