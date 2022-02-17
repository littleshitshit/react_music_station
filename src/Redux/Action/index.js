//歌单覆盖播放列表
export const override_playlist=data=>({type:"override_playlist",data});
//添加歌曲到播放列表
export const add_playlist=data=>({type:"add_playlist",data})
//控制lyric_comments组件pop
export const control_lyric_comments = () => ({ type: 'control_lyric_comments' })
//控制playlist组件pop
export const control_playlist = () => ({ type: 'control_playlist' })
//控制search组件pop
export const control_search = data => ({ type: 'control_search' ,data})
//控制userinfo组件pop
export const control_userinfo = () => ({ type: 'control_userinfo' })
//将搜索信息发送到Search组件
export const send_search_rs=data=>({type:"send_search_rs",data});
//将搜索keyword发送到SearchRs组件
export const send_searchRs_keyword=data=>({type:"send_searchRs_keyword",data});
//保存当前用户信息
export const current_userinfo=data=>({type:"current_userinfo",data});
//保存当前音乐信息
export const now_playing=data=>({type:'now_playing',data})
//更新当前用户信息
export const update_userinfo=()=>({type:'update_userinfo'})
//用于同步时间
export const sync_timeupdate=data=>({type:'sync_timeupdate',data})
//暂停动画
export const stop_animation=data=>({type:'stop_animation',data})
export const action_animation=data=>({type:'action_animation',data})
//同步评论
export const update_comments=data=>({type:'update_comments',data})


