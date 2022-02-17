export default (preState =false, action) => {
    const { type, data } = action
    switch (type) {
        case "update_userinfo":
            // 返回keyword
            return !preState;
        default:
            return preState
    }

}