export default (preState = false, action) => {
    const { type} = action;
    switch (type) {
        case "control_userinfo":
            return !preState
        default:
            return preState
    }
}