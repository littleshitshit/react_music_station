import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
//引入reducer
import control_lyric_comments_state from './Reducer/control_pop/control_lyric_comments'
import control_playlist_state from './Reducer/control_pop/control_playlist'
import control_search_state from './Reducer/control_pop/control_search'
import control_userinfo_state from './Reducer/control_pop/control_userinfo'
import playlist_state from './Reducer/add_or_override_playlist'
import send_search_rs_state from './Reducer/send_search_rs'
import send_searchRs_keyword_state from './Reducer/send_searchRs_keyword'
import current_userinfo_state from './Reducer/current_userinfo'
import now_playing_state from './Reducer/now_playing'
import update_userinfo from './Reducer/update_userinfo'
import sync_timeupdate_state from './Reducer/sync_timeupdate'
import animation_state from './Reducer/animation'
import update_comments_state from './Reducer/update_comments'

//reducer统一发送
const AllReducers = combineReducers({
    //控制组件弹出的state
    control_lyric_comments_state,
    control_playlist_state,
    control_search_state,
    control_userinfo_state,
    //歌单数据数组
    playlist_state,
    //展示在Search组件中的搜素结果
    send_search_rs_state,
    //展示在SearchRs组件中的搜素结果
    send_searchRs_keyword_state,
    //当前用户信息
    current_userinfo_state,
    //当前播放的音乐信息
    now_playing_state,
    //更新用户信息
    update_userinfo,
    //用于同步的时间
    sync_timeupdate_state,
    //控制动画状态
    animation_state,
    update_comments_state
    

})
export default createStore(AllReducers, composeWithDevTools())
