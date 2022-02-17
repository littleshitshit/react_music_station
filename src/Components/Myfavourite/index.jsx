import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import '../../Css/Myfavourite/Myfavourite.css'
import axios from 'axios'
import { add_playlist, now_playing, update_userinfo } from '../../Redux/Action'
const UI = (props) => {
    //------------------------------------当用户信息改变，更新用户收藏夹
    const [myfavourite, setMyfavourite] = useState([]);
    useEffect(() => {
        if (!props.current_userinfo_state.user_like) {
            setMyfavourite([])
            return
        }
        //当前用户变收藏歌单就变
        let songlist_string = props.current_userinfo_state.user_like
        //获取当前用户的喜欢列表
        let songlist_arr = songlist_string.split(',')
        let wait_arr_processed = songlist_arr.map((item) => {
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
            console.log('收藏列表更新成功');
            setMyfavourite(v)
        })
    }, [props.current_userinfo_state])
    //------------------处理添加音乐item
    const process_add_playlist = (e, item) => {
        e.stopPropagation();
        props.add_playlist(item)
    }
    const no_like = (e, song_id) => {
        e.stopPropagation();
        axios.get(`http://127.0.0.1:8080/my/no_like/${song_id}`, {
            headers: {
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then((v) => {
            console.log('取消收藏成功');
            props.update_userinfo()
        })
    }
    return (
        <div id='my_favourite'>
            {
                myfavourite.map((item, index) => {
                    return (
                        <div id='my_favourite_item' key={item[0].song_id} onDoubleClick={(e) => process_add_playlist(e, item[0].song_id)}>
                            <span className='item_song_index'>{index}</span>
                            <span className='item_song_like' style={{ backgroundPositionY: Number(item[0].song_like) ? '-530px' : '-501px' }}
                                onClick={(e)=>no_like(e,item[0].song_id)}
                            ></span>
                            <span className='item_song_name'>{item[0].song_name}</span>
                            <span className='item_singer_name'>{item[0].singer_name}</span>
                            <span className='item_music_time'>{item[0].song_time}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        //从当前用户状态中提取喜欢的歌曲
        current_userinfo_state: state.current_userinfo_state
    }), {
    //发送action
    add_playlist, now_playing, update_userinfo
}
)(UI)