export const initialState = {
    items: [],
    isLoading: false,
    isSubmitting: false,
    screenError: null,
    ui: {editErrors: {},filterText: "",filterItems: [], editingId: null, sorter: "number_sorter"},
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
}