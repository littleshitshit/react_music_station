export default (preState="000000",action)=>{
    const{type,data}=action;
    switch (type) {
        case "sync_timeupdate":
            return data;
        default:
            return preState
    }
}