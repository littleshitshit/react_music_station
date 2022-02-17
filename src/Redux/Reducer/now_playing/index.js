export default (preState ={
    song_time:"00:00"
}, action) => {
    const { type, data } = action
    switch (type) {
        case "now_playing":
            return data;
        default:
            return preState
    }

}