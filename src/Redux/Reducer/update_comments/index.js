export default (preState =false, action) => {
    const { type, data } = action
    switch (type) {
        case "update_comments":
            // 返回keyword
            return !preState;
        default:
            return preState
    }

}