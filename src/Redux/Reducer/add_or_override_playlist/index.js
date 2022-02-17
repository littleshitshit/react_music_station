export default (preState = [], action) => {
    const { type, data } = action
    switch (type) {
        case "override_playlist":
            // 将字符串转为数组
            return data.split(',');
        case "add_playlist":
            //数组去重
            for (let i of preState) {
                if (data === i) {
                    return preState
                }
            }
            //返回去重,更新的数组
            return [data, ...preState];

        default:
            return preState
    }

}