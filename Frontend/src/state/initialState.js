export const initialState = {
    auth: {
        user: null,
        userInfo: {},
        isLoading: true,
        error: null,
        lastVisitedPage: null,
    },
    events:{
    list: [],
    isLoading: false,
    isSubmitting: false,
    isEmpty: false,
    screenError: null,
    ui: {editErrors: {},editValues:null ,filterText: "",filterItems: [], editingId: null, sorter: "number_sorter"},
    form: {
        values: {
            name: "",
            date: "",
            location: "",
            capacity: "",
            description: "",
        },
        touched: {},
        errors: {},
        isValid: true,
        generalError: null
    }
    },
    users:{
        list: [],
        isLoading: false,
        isSubmitting: false,
        isEmpty: false,
        screenError: null,
        ui: {editErrors: {},editValues:null ,filterText: "",filterItems: [], editingId: null, sorter: "number_sorter"},
        form: {
            values: {
                name: "",
                email: "",
                password: "",
            },
            touched: {},
            errors: {},
            isValid: true,
            generalError: null
        }
    },
    login:{
        list: [],
        isLoading: false,
        isSubmitting: false,
        isEmpty: false,
        screenError: null,
        ui: {editErrors: {},editValues:null ,filterText: "",filterItems: [], editingId: null, sorter: "number_sorter"},
        form: {
            values: {
                name: "",
                email: "",
                password: "",
            },
            touched: {},
            errors: {},
            isValid: true,
            generalError: null
        }
    },
    registrations:{
        list: [],
        isLoading: false,
        isSubmitting: false,
        isEmpty: false,
        screenError: null,
    },
    registration:{
        list: [],
        isLoading: false,
        isSubmitting: false,
        isEmpty: false,
        screenError: null,
        ui: {editErrors: {},editValues:null ,filterText: "",filterItems: [], editingId: null, sorter: "number_sorter"},
        form: {
            values: {
                name: "",
                email: "",
                password: "",
            },
            touched: {},
            errors: {},
            isValid: true,
            generalError: null
        }
    },
}

