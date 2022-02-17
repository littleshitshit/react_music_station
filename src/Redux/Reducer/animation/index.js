export default (preState = false, action) => {
    const { type, data } = action;
    switch (type) {
        case "stop_animation":
            return false;
        case "action_animation":
            return true;
        default:
            return preState
    }
}