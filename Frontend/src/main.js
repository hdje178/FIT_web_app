import {createStore} from "./state/store.js";
import {saveToLocalStorage, loadFromLocalStorage} from "./utils/storage.js";
import {bindEvents} from "./ui/events.js";
import {renderApp} from "./ui/render.js";


const store = createStore();
store.subscribe((state) => saveToLocalStorage(state))
store.subscribe((state) => renderApp(state))
bindEvents(store);
store.loadItems();
