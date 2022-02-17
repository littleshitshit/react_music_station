export default (preState = [], action) => {
    const { type, data } = action
    switch (type) {
        case "send_search_rs":
            //返回数组
            return data;
        default:
            return preState
    }

}