import {initialState} from "./initialState.js";
import {loadFromLocalStorage, saveToLocalStorage, STORAGE_KEY} from "../utils/storage.js";
import {validateEditTable, validateForm} from "./validation.js";

let listeners = [];
let nextId = Number(localStorage.getItem("lr1_nextId") ?? "1");

let state = structuredClone(initialState);

export function createStore() {
    function addItems(item) {
        item.id = nextId++;
        state.items.push(item);
        localStorage.setItem("lr1_nextId", String(nextId));
        listeners.forEach(fn => fn(state));
    }
    const store = {
        getState: () => state,
        loadItems: () => {
            state.items = loadFromLocalStorage(STORAGE_KEY);
            if (state.items.length > 0) {
                const maxId = Math.max(...state.items.map(i => Number(i.id) || 0));
                nextId = Math.max(nextId, maxId + 1);
                localStorage.setItem("lr1_nextId", String(nextId));
            }
            listeners.forEach(fn => fn(state));
        },
        deleteItems: (id) => {
            const index = state.items.findIndex(item => item.id === id);
            if (index !== -1) {
                state.items.splice(index, 1);
            }
            if (state.ui.filterText) {
                state.ui.filterItems = state.items.filter(item =>
                    item.name.toLowerCase().includes(state.ui.filterText.toLowerCase())
                );
            }
            listeners.forEach(fn => fn(state));
        },
        resetSearch: () => {
            state.ui.filterText = '';
            state.ui.filterItems = [];
            listeners.forEach(fn => fn(state));
        },
        saveItems: (id, values) => {
            const index = state.items.findIndex(item => item.id === id);
            state.ui.editErrors = validateEditTable(values);
            const isValid = Object.values(state.ui.editErrors).every(v => v === true);
            console.log("state.ui.editErrors", state.ui.editErrors);
            console.log("isValid", isValid);
            if (index !== -1) {
                state.items[index] = {
                    ...state.items[index],
                    ...values,
                    capacity: Number(values.capacity),
                };
            }
            if (!isValid) {
                listeners.forEach(fn => fn(state));
                return;
            }
            state.ui.editingId = null;
            state.ui.editErrors = structuredClone(initialState.ui.editErrors);
            listeners.forEach(fn => fn(state));

        },
        editItems: (id) => {
            state.ui.editingId = id;
            listeners.forEach(fn => fn(state));
        },
        setFilterText: (text) => {
            state.ui.filterText = text;
            state.ui.filterItems = state.items.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
            listeners.forEach(fn => fn(state));
        },
        setSorter: (sort) => {
            state.ui.sorter = sort;
            if(state.ui.sorter === "number_sorter"){
                state.items.sort((a, b) => b.id - a.id);
            }
            else if(state.ui.sorter === "date_sorter"){
                state.items.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
            }
            else if(state.ui.sorter === "name_sorter"){
                state.items.sort((a,b)=> a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            }
            else if(state.ui.sorter === "capacity_sorter") {
                state.items.sort((a, b) => b.capacity - a.capacity);
            }
            listeners.forEach(fn => fn(state));
        },
        updateField: (name, value) => {
            console.log("updateField", name, value);
            state.form.touched[name] = true;
            state.form.values[name] = value;
            state.form.errors = validateForm(state.form);
            state.form.isValid = Object.keys(state.form.errors).length === 0;
            listeners.forEach(fn => fn(state));
        },
        submitForm: () => {
            state.form.touched = {
                name: true, date: true, location: true, capacity: true, description: true
            };
            const errors = validateForm(state.form);
            state.form.errors = errors;
            state.form.isValid = Object.keys(errors).length === 0;

            if (!state.form.isValid) {
                listeners.forEach(fn => fn(state));
                return;
            }
            console.log(state.form.values)
            const toAdd = {
                ...state.form.values,
                capacity: Number(state.form.values.capacity),
                description: state.form.values.description?.trim() || "-",
            };
            addItems(toAdd);
            state.form = structuredClone(initialState.form);
            state.ui.filterItems = state.items.filter(item => item.name.toLowerCase().includes(state.ui.filterText.toLowerCase()));
            listeners.forEach(fn => fn(state));
            },
        resetForm: () => {
            state.form.touched = {}
            state.form.values = structuredClone(initialState.form.values);
            state.form.errors = structuredClone(initialState.form.errors);
            state.form.isValid = true;
            listeners.forEach(fn => fn(state));
        },
        subscribe: (fn) => {
            listeners.push(fn);
        }
    }
    return store;
}

