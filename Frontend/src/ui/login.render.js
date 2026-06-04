export function renderLoginApp(state) {
    renderLoginFormErrors(state);
}
function renderLoginFormErrors(state) {
    let fields = ["email", "password"];
    let submit_btn = document.querySelector(".register-form_button_submit button");
    fields.forEach(field => {
        let el = document.getElementById(`${field}_error`);
        let input = document.getElementById(`register-form_${field}`);
        const message = state.login.form.touched[`${field}`] ? state.login.form.errors[field] ?? "": "";
        el.textContent = message;
        message? input.classList.add("invalid") : input.classList.remove("invalid");
        if (message) {
            el.classList.add("visible");
        } else {
            el.classList.remove("visible");
        }
    });
    submit_btn.disabled = !state.login.form.isValid;
    const generalError = document.getElementById("general_error");
    if (generalError) {
        generalError.textContent = state.login.form.generalError ?? "";
    }
}