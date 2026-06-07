export function renderRegistrationApp(state) {
    renderRegistrationFormErrors(state);
}
function renderRegistrationFormErrors(state) {
    let fields = ["name", "email", "password"];
    let submit_btn = document.querySelector(".register-form_button_submit button");
    fields.forEach(field => {
        let el = document.getElementById(`${field}_error`);
        let input = document.getElementById(`register-form_${field}`);
        const message = state.userRegistrations.form.touched[`${field}`] ? state.userRegistrations.form.errors[field] ?? "": "";
        el.textContent = message;
        message? input.classList.add("invalid") : input.classList.remove("invalid");
        if (message) {
            el.classList.add("visible");
        } else {
            el.classList.remove("visible");
        }
    });
    submit_btn.disabled = !state.userRegistrations.form.isValid;
    const generalError = document.getElementById("general_error");
    if (generalError) {
        generalError.textContent = state.userRegistrations.form.generalError ?? "";
    }
}