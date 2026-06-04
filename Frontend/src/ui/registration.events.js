export function bindEventsRegistration(store){
    const input = document.querySelectorAll("#register-form input, #register-form textarea");
    input.forEach(el => {
        el.addEventListener("blur", (event) => {
            let value = event.target.value.trim();
            store.updateFieldRegistration(event.target.name, value )
        })
    })
    const spinner = document.querySelector(".spinner");
    const wrapper = document.querySelector(".spinner-wrapper");

    store.subscribe((state) => {
        if (state.auth.isLoading) {
            spinner.classList.remove("hidden");
            wrapper.classList.remove("hidden");
            wrapper.style.pointerEvents = 'auto';
        } else {
            spinner.classList.add("hidden");
            wrapper.classList.add("hidden");
            wrapper.style.pointerEvents = 'none';
        }
    });
    const btn = document.querySelector(".register-form_button_reset");
    btn.addEventListener("click", () => {
        const form = document.getElementById('register-form');
        if (form) form.reset();
        store.resetFormRegistration()
    });
    const form = document.getElementById("register-form");
    form.addEventListener("submit", async function (event) {
        console.log("submit спрацював");
        event.preventDefault();
        await store.submitFormRegistration();
        const form = document.getElementById('register-form');
        if (store.getState().registration.form.isValid) {
            form.reset();
        }
    })
}