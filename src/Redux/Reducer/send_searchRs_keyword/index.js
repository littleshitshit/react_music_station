export default (preState = "", action) => {
    const { type, data } = action
    switch (type) {
        case "send_searchRs_keyword":
            // 返回keyword
            return data;
        default:
            return preState
    }

}