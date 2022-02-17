import { connect } from 'react-redux'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {update_comments} from '../../Redux/Action'
const UI = (props) => {
    const [lyric_classname, setLyric_classname] = useState([])
    const lyric_wrapper_all = useRef()
    const album = useRef()
    //---------------------------------------播放源改变就获取歌词
    useEffect(() => {
        //如果当前没有播放源就不获取
        if (props.now_playing_state.song_id === undefined) return

        axios.get(`http://127.0.0.1:8080/api/getSongLryic/${props.now_playing_state.song_id}`).then((v) => {
            console.log("切换歌词");
            console.log(props.now_playing_state.song_id);
            //去除\n生成新数组
            let lyric = v.data.data.rows[0].song_lryic.split(/\\n/)
            let temp_arr = [];
            //设置歌词数组，用于显示
            lyric.forEach(item => {
                //获取时间[1][2]和歌词[3]
                const reg_rs = /\[(.*):(.*)\..*\](.*)/g.exec(item);
                //最后一个歌词为null，直接跳出
                if (reg_rs === null) {
                    return;
                }
                let lyric_item = [[`${reg_rs[1]}${reg_rs[2]}`], [`${reg_rs[3]}`]];
                temp_arr.push(lyric_item)
            })
            setLyric_classname(temp_arr)
        })
    }, [props.now_playing_state.song_id]);
    //----------------------------------同步高亮
    useEffect(() => {
        if (props.now_playing_state.song_id === undefined) return
        //设置相应的标签高亮
        console.log("歌曲进度改变");
        let p_arr = Array.from(lyric_wrapper_all.current.children);
        p_arr.forEach(item => {
            if (item.className === props.sync_timeupdate_state) {
                console.log("匹配到了！");
                //先清理一遍数组
                p_arr.forEach(item => {
                    item.style.color = "#a3a3a3";
                    item.style.fontSize = "18px";
                })
                //存储当前时间
                item.style.color = "white";
                item.style.fontSize = "25px";
                lyric_wrapper_all.current.style.marginTop = 200 - item.offsetTop + "px"
                return
            }
        })

    }, [props.sync_timeupdate_state])
    //------------------------------------播放源改变加载获取评论
    const [comments, setComments] = useState([])
    useEffect(() => {
        //如果当前没有播放源就不获取
        if (props.now_playing_state.song_id === undefined) return
        
        axios.get(`http://127.0.0.1:8080/api/getSongComments/${props.now_playing_state.song_id}/0/10`).then((v) => {
            if (v.data.status === 0) {
                console.log(v.data.data.rows[0].commen)
                setComments(v.data.data.rows);
            } else {
                console.log(v.data.message);
            }
        })
    }, [props.now_playing_state.song_id,props.update_comments_state]);
    //-----------------------------------提交评论
    const my_comments = useRef()
    const submit_comments = () => {
        const data = {
            comments_id: props.now_playing_state.comments_id,
            comments_value: my_comments.current.value,
            user_id: String(props.current_userinfo_state.user_id)
        }
        console.log(data);
        axios.post('http://127.0.0.1:8080/my/submitSongComments',
            data, {
            headers: {
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then((v) => {
            console.log(v.data);
            if (v.data.status === 0) {
                console.log('评论提交成功');
                // props.update_userinfo()
                props.update_comments()

            } else {
                alert(v.data.message)
            }
        })

    }
    return (
        <div id='lyric_comments' style={{ top: props.control_lyric_comments_state ? '0%' : '100%' }}>
            <div id='lyric'>
                <div id='album' >
                    <div className={props.animation_state ? 'active' : 'paused'}>
                        <img src={props.now_playing_state.song_img} />
                    </div>
                    {/* <div id='album_bar'></div> */}
                </div>
                <div className='lyric_show'>
                    <p className='song_name'>{props.now_playing_state.song_name}</p>
                    <p className='singer_name'>{props.now_playing_state.singer_name}</p>
                    <div className='lyric_wrapper'>
                        <div id="lyric_wrapper" ref={lyric_wrapper_all}>
                            {
                                lyric_classname.map((item, index) => {
                                    return (
                                        // 根据当前timeupdate,让相应的p亮起来
                                        <p className={item[0]} key={index}>{item[1]}</p>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

            </div>
            <div id='comments'>
                <h1>热门评论</h1>
                <div id="textarea">
                    <input type="text" ref={my_comments}></input>
                    <button onClick={submit_comments}>评论</button>


                </div>
                {
                    comments.map((item, index) => {
                        return (
                            <div className='comment_item' key={index}>
                                <div><img src={item.user_img} alt="" />
                                    <p>{item.username}</p></div>
                                <div><p>{item.comments_value}</p></div>

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
        control_lyric_comments_state: state.control_lyric_comments_state,
        now_playing_state: state.now_playing_state,
        sync_timeupdate_state: state.sync_timeupdate_state,
        animation_state: state.animation_state,
        current_userinfo_state: state.current_userinfo_state,
        update_comments_state:state.update_comments_state

    }), {
    //发送action
    update_comments
}
)(UI)