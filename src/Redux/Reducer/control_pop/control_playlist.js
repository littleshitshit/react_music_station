export default (preState = false, action) => {
    const { type, data } = action;
    switch (type) {
       
        case "control_playlist":
            return !preState
        
        default:
            return preState
    }
}