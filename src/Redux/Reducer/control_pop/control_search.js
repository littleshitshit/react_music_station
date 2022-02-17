export default (preState = false, action) => {
    const { type, data } = action;
    switch (type) {

        case "control_search":
            return data

        default:
            return preState
    }
}