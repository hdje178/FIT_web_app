
export function bindEvents(store) {

    const searchContainer = document.querySelector(".search_for_element");

    searchContainer.addEventListener("click", function (event) {
        const target = event.target;
        let input = document.querySelector("#input_for_search");

        if (target.id === "button_for_search") {
            store.setFilterText(input.value.trim());
        }

        if (target.id === "button_for_reset") {
            store.resetSearch();
            input.value = "";
        }
    });
    const input = document.querySelectorAll("#register-form input, #register-form textarea");
    input.forEach(el => {
        el.addEventListener("blur", (event) => {
            const value = event.target.value.trim();
            const finalValue = (event.target.name === "description" && value === "") ? "-" : value;
            console.log("finalValue:", finalValue);
            store.updateField(event.target.name, finalValue )
        })
    })


    const select = document.querySelector("#table_sorter");
    select.addEventListener("change", (event) => {
        const target = event.target.value;
        store.setSorter(target);
    })


    const tbody = document.querySelector(".register_table_body");
    tbody.addEventListener("click", function (event) {
        const target = event.target;
        if (target.classList.contains("delete-btn")) {
            const id = Number(target.dataset.id);
            store.deleteItems(id)
            return
        }
        if (target.classList.contains("edit-btn")) {
            const id = Number(target.dataset.id);
            store.editItems(id)
            return
        }
        if (target.classList.contains("save-btn")) {
            const id = Number(target.dataset.id);
            const rew = target.closest('tr');
            const cells = rew.querySelectorAll('td');
            store.saveItems(id, {name: cells[1].textContent.trim(), date: cells[2].textContent,
                location: cells[3].textContent.trim(), capacity: cells[4].textContent.trim(),
                description: cells[5].textContent.trim()})
        }
    })


    const btn = document.querySelector(".register-form_button_reset");
    btn.addEventListener("click", () => {
        const form = document.getElementById('register-form');
        if (form) form.reset();
        store.resetForm()
    });
    const form = document.getElementById("register-form");
    form.addEventListener("submit", function (event) {
        console.log("submit спрацював");
        event.preventDefault();
        store.submitForm();
        const form = document.getElementById('register-form');
        if (store.getState().form.isValid) {
            form.reset();
        }
    })
}