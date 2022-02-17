export default (preState = false, action) => {
    const { type, data } = action;
    switch (type) {
        case "control_lyric_comments":
            return !preState
        
        default:
            return preState
    }
}