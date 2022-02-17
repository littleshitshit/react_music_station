import { connect } from 'react-redux'
import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import '../../Css/Playlist/Playlist.css'
import { override_playlist, now_playing, update_userinfo } from '../../Redux/Action'
const UI = (props) => {
    const [playlist, setPlaylist] = useState([]);
    //----------------------------------------每一次更新都会重新加载好同步喜欢
    useEffect(() => {
        if(!props.playlist_state.length){
            // console.log("播放列表为空");
            return
        }
        console.log("播放列表更新");
        //根据数组扩展信息
        let wait_arr_processed = props.playlist_state.map((item) => {
            return new Promise((res, rej) => {
                axios.get(`http://127.0.0.1:8080/api/getSonginfo/${item}`).then((v) => {
                    res(v.data.data.rows)
                })
            })
        })
        //等所有异步都完成后，接受所有返回的数组
        let p = Promise.all(wait_arr_processed)
        p.then((v) => {
            //所有数组的集合
            setPlaylist(v)
        })
    }, [props.playlist_state, props.current_userinfo_state.user_like])
    
    //--------------------------------设置当前播放背景色-------------------------------
    // const list_items = useRef();
    // useEffect(() => {

    //     if (props.now_playing_state.song_id === undefined) {
    //         console.log("当前无播放");
    //         return
    //     }
    //     console.log("当前有播放");
    //     // props.playlist_state.forEach((item, index) => {
    //     //     list_items.current.children[index].style.backgroundColor = "";

    //     // })
    //     // //设置当前索引
    //     props.playlist_state.forEach((item, index) => {
    //         if (props.now_playing_state.song_id === item) {
    //             console.log(index);
    //             // list_items.current.children[index].style.backgroundColor = "rgb(90, 90, 90)";
    //         }
    //     })
    // }, [props.now_playing_state])
    const no_like = (song_id) => {
        console.log("点击取消收藏");
        axios.get(`http://127.0.0.1:8080/my/no_like/${song_id}`, {
            headers: {
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then((v) => {
            console.log('取消收藏ok');
            props.update_userinfo()
        })
    }
    const yes_like = (song_id) => {
        console.log("点击收藏");
        axios.get(`http://127.0.0.1:8080/my/yes_like/${song_id}`, {
            headers: {
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then((v) => {
            console.log('收藏成功');
            props.update_userinfo()
        })
    }
    const switch_like=(switch_like,song_id)=>{
        if(switch_like){
            no_like(song_id)
        }else{
            yes_like(song_id)
        }
        
    }
    return (
        <div id='playlist' style={{ top: props.control_playlist_state ? '70px' : '100%' }}>
            <div className='list_tab'>
                <div className='tab_left'>
                    <p>当前播放</p>
                    <p>总首</p>
                </div>
                <div className='tab_right'>
                    <p>收藏全部</p>
                    <p onClick={() => props.override_playlist([])}>清空列表</p>
                </div>
            </div >

            <div id='list_items'
                // ref={list_items}
            >
                {
                    playlist.map((item) => {
                        return (
                            <div className='list_item' key={item[0].song_id}
                                onDoubleClick={() => props.now_playing(item[0])}
                            >
                                <span className='item_song_name'>{item[0].song_name}</span>
                                <span className='item_song_like' style={{ backgroundPositionY: Number(item[0].song_like) ? '-530px' : '-501px' }}
                                    onClick={()=>switch_like(Number(item[0].song_like),item[0].song_id)}
                                ></span>
                                <span className='item_singer_name'>{item[0].singer_name}</span>
                                <span className='item_music_time'>{item[0].song_time}</span>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        //pop playlist组件
        control_playlist_state: state.control_playlist_state,
        //播放列表数组
        playlist_state: state.playlist_state,
        now_playing_state: state.now_playing_state,
        update_song_index_state: state.update_song_index_state,
        current_userinfo_state: state.current_userinfo_state

    }), {
    //发送action
    override_playlist, now_playing, update_userinfo
}
)(UI)