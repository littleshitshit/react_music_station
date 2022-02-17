import { connect } from 'react-redux'
import '../../Css/Footer/Footer.css'
import React, { useState, useEffect, useRef } from 'react'
import { control_lyric_comments, control_playlist, now_playing, update_userinfo,sync_timeupdate,action_animation,stop_animation} from '../../Redux/Action'
import axios from 'axios'

const UI = (props) => {
    const audio = useRef();//音乐
    const [cover, setCover] = useState(false)//歌曲图片遮罩
    //------------------------------------------------------音量控制----------------------------------------------------------------
    const [volume, setVolume] = useState(50)//图形音量
    const [preVolume, setPreVolume] = useState();//保存之前的音量
    //静音/之前的音量 切换
    const mute = () => {
        //保存之前的音量
        setPreVolume(volume)
        if (volume) {
            audio.current.volume = 0
            setVolume(0);
        } else {
            audio.current.volume = preVolume / 100
            setVolume(preVolume)
        }
    }
    const control_volume = (e) => {
        //控制资源音量
        //控制图形音量
        let volume_percent = e.clientX - e.target.offsetLeft;
        audio.current.volume = volume_percent / 100
        setVolume(volume_percent);
    }

    //----------------------------------------------------播放模式------------------------------------------------------------------
    //用于设置播放模式背景图片
    const playback_mode_but = useRef()
    //播放模式
    const [playback_mode_arr] = useState(["songlist_loop", "song_loop", "song_random"]);
    //切换播放模式
    const switch_playback_mode = () => {
        let save_first = playback_mode_arr.shift();
        playback_mode_arr.push(save_first);
        switch (playback_mode_arr[0]) {
            case "songlist_loop":
                console.log("songlist_loop");
                audio.current.loop = false
                playback_mode_but.current.style.backgroundPositionX = "-1px";
                playback_mode_but.current.style.backgroundPositionY = "-343px";

                break;
            case "song_loop":
                console.log("song_loop");
                audio.current.loop = true

                playback_mode_but.current.style.backgroundPositionX = "-64px";
                playback_mode_but.current.style.backgroundPositionY = "-343px";
                break;
            case "song_random":
                console.log("song_random");
                audio.current.loop = false

                playback_mode_but.current.style.backgroundPositionX = "-64px";
                playback_mode_but.current.style.backgroundPositionY = "-247px";
                break;
        }
    }

    //---------------------------------------------根据播放模式处理音乐--------------------------------------------
    const base_on_the_playback = () => {
        //暂停动画

        switch (playback_mode_arr[0]) {
            case "songlist_loop":
                console.log("循环列表");
                //调用播放下一首歌功能
                next_song();
                //获取当前音乐的索引值
                break;
            case "song_random":
                console.log("随机播放");
                let random_index = Math.floor(Math.random() * props.playlist_state.length);
                //now_playing必须传递对象
                axios.get(`http://127.0.0.1:8080/api/getSonginfo/${props.playlist_state[random_index]}`).then((v) => {
                    props.now_playing(v.data.data.rows[0])
                })
                break;
        }
    }
    //---------------------------------------------------播放按钮功能---------------------------------------------------------
    const [play_pause_bgpY, setPlay_pause_img_bgpY] = useState(false)
    const play_and_pause = () => {
        if (props.now_playing_state.song_id) {
            if (audio.current.paused) {
                audio.current.play()
                setPlay_pause_img_bgpY(true)
            } else {
                audio.current.pause()
                setPlay_pause_img_bgpY(false)
            }
        }
    }
    //----------------------------------------当前播放源变化自动播放,并获取当前索引,发送播放源给歌词组件----------------------------------------
    const [song_index, setSong_index] = useState(null);//存储歌曲索引
    const [song_like_storage, setSong_like_storage] = useState(0);//存储歌曲索引
    useEffect(() => {
        //如果当前没有播放源就不播放
        if (props.now_playing_state.song_id === undefined) return
        //否则当now_playing值变了就自动播放
        audio.current.play()
        //获取当前索引
        props.playlist_state.forEach((item, index) => {
            if (props.now_playing_state.song_id === item) {
                setSong_index(index)
                //获取索引歌曲的song_like
                axios.get(`http://127.0.0.1:8080/api/getSonginfo/${props.playlist_state[index]}`).then((v) => {
                    console.log('更新歌曲的喜欢')
                    setSong_like_storage(Number(v.data.data.rows[0].song_like))
                })

            }
        })
    }, [props.now_playing_state, props.current_userinfo_state])
    //--------------------------------------------当播放列表改变了,发送第一个当播放源-------------------
    useEffect(() => {
        //如果当前列表为空则不播放
        if (!props.playlist_state.length) return
        //否则设置播放源为第一个
        console.log("播放列表改变了，准备自动播放第一个");
        axios.get(`http://127.0.0.1:8080/api/getSonginfo/${props.playlist_state[0]}`).then((v) => {
            console.log('播放第一个播放源');
            props.now_playing(v.data.data.rows[0])
        })
    }, [props.playlist_state])
    //-----------------------------------------播放下一首歌---------------------------------------------------
    const next_song = () => {
        let index = song_index;
        //如果当前为最后一首歌，则播放第一首歌
        if (index + 1 === props.playlist_state.length) {
            console.log('最后一首');
            axios.get(`http://127.0.0.1:8080/api/getSonginfo/${props.playlist_state[0]}`).then((v) => {
                props.now_playing(v.data.data.rows[0])
            })
            //否则就自动播放下一首歌
        } else {
            axios.get(`http://127.0.0.1:8080/api/getSonginfo/${props.playlist_state[index + 1]}`).then((v) => {
                props.now_playing(v.data.data.rows[0])
            })
        }
    }
    //-------------------------------------------------播放上一首歌-----------------------------------------------------
    const pre_song = () => {
        let index = song_index;
        //如果当前为第一首歌，则播放最后一首歌
        if (index === 0) {
            axios.get(`http://127.0.0.1:8080/api/getSonginfo/${props.playlist_state[props.playlist_state.length - 1]}`).then((v) => {
                props.now_playing(v.data.data.rows[0])
            })
            //否则播放上一首
        } else {
            axios.get(`http://127.0.0.1:8080/api/getSonginfo/${props.playlist_state[index - 1]}`).then((v) => {
                props.now_playing(v.data.data.rows[0])
            })
        }
    }
    //---------------------------------数据驱动进度条，进度条驱动数据---------------------------------------
    //进度条state
    const [progress, setProgress] = useState(`0%`);
    //时间
    const [duration_minute, setDuration_Minute] = useState("00")
    const [duration_second, setDuration_second] = useState("00")

    const [current_minute, setCurrent_minute] = useState("00")
    const [current_second, setCurrent_second] = useState("00")
    // const [current_m_second, setCurrent_m_second] = useState("00.00")

    //监听正在播放(实际进度驱动可视进度)
    const timeUpdate = () => {
        //---------------------------设置进度条
        let percent = audio.current.currentTime / audio.current.duration * 100
        setProgress(`${percent}%`)
        //总时间
        let duration_m = parseInt(audio.current.duration / 60);//分钟
        duration_m < 10 ? setDuration_Minute(`0${duration_m}`) : setDuration_Minute(duration_m)
        let duration_s = parseInt(audio.current.duration % 60);//秒
        duration_s < 10 ? setDuration_second(`0${duration_s}`) : setDuration_second(duration_s)
        //当前时间
        let current_m = parseInt(audio.current.currentTime / 60)//分钟
        current_m < 10 ? setCurrent_minute(`0${current_m}`) : setCurrent_minute(current_m)
        let current_s = parseInt(audio.current.currentTime % 60)//秒
        current_s < 10 ? setCurrent_second(`0${current_s}`) : setCurrent_second(current_s)
        //用于同步
        props.sync_timeupdate(`${current_minute}${current_second}`)
        
    }
    //移动进度(可视进度驱动实际进度)
    const move_progress = (e) => {
        //没有加载音乐时的处理
        if (!props.now_playing_state.song_id) return
        //鼠标所在位置
        let mouse_at = e.clientX - e.currentTarget.offsetLeft;
        //总进度条长度
        let progress_bar_width_px = window.getComputedStyle(e.currentTarget).width;
        let progress_bar_width=progress_bar_width_px.split("px")[0];
        //可视长度/可视总进度条长度=可视进度占比
        //可视进度占比
        let mouse_percent = mouse_at / progress_bar_width;
        audio.current.currentTime = mouse_percent* audio.current.duration;
        audio.current.play()

    }
    //------------------------------------------收藏
    const no_like = (song_id) => {
        axios.get(`http://127.0.0.1:8080/my/no_like/${song_id}`, {
            headers: {
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then((v) => {
            console.log('取消收藏成功');
            props.update_userinfo()
        })
    }
    const yes_like = (song_id) => {
        axios.get(`http://127.0.0.1:8080/my/yes_like/${song_id}`, {
            headers: {
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then((v) => {
            console.log('收藏成功');
            props.update_userinfo()
        })
    }
    const switch_like = (switch_like, song_id) => {
        if (switch_like) {
            no_like(song_id)
        } else {
            yes_like(song_id)
        }

    }
    //---------------------------------控制唱片旋转
    const song_playing=()=>{
        setPlay_pause_img_bgpY(true)
        props.action_animation()
    }
    const song_paused=()=>{
        setPlay_pause_img_bgpY(false)
        props.stop_animation()
    }
    return (
        <footer>
            <div id='footer_pop' style={{ bottom: props.control_lyric_comments_state ? '-100%' : '0px' }}>
                <div className='hidden'><div id='go_back' onClick={props.control_lyric_comments}></div></div>
                <div className='show'>
                    <img src={props.now_playing_state.song_img} onMouseEnter={() => setCover(true)} />
                    <div>
                        <p>{props.now_playing_state.song_name}</p>
                        <p>{props.now_playing_state.singer_name}</p>
                    </div>
                    <div id='img_cover' style={{ display: cover ? 'block' : 'none' }} onMouseLeave={() => setCover(false)} onClick={props.control_lyric_comments}></div>
                </div>
            </div>
            {/* 播放和进度条 */}
            <div id="footer_control" >
                <div className='buts'>
                    <button ref={playback_mode_but}
                        onClick={switch_playback_mode}
                    ></button>
                    <button className='pre_song' onClick={pre_song} />
                    <button className='play' style={{ backgroundPositionY: play_pause_bgpY ? '-167px' : '-206px' }} onClick={play_and_pause} />
                    <button className='next_song' onClick={next_song} />
                    <button style={{ backgroundPositionY: song_like_storage ? '-530px' : '-501px' }}
                        onClick={() => switch_like(song_like_storage, props.now_playing_state.song_id)}
                    ></button>
                </div>
                <div className='progress_bar'>
                    <span>{current_minute}:{current_second}</span>
                    <div className='bar' onClick={move_progress}>
                        <div className='now' style={{ width: progress }}></div>
                    </div>
                    <span>{props.now_playing_state.song_time}</span>
                </div>
            </div>
            {/* 音乐功能区 */}
            <div id='footer_other_function'>
                <button id="volume" className={volume ? 'volume' : 'mute'} onClick={mute} />
                <progress value={volume} max="100" id='volume_control_bar'
                    onClick={control_volume}></progress>
                <button id="footer_playlist" onClick={props.control_playlist} />
            </div>
            {/* 音乐 */}
            <audio ref={audio} src={`http://127.0.0.1:8080/music/${props.now_playing_state.song_id}.flac`}
                onPlay={song_playing}
                onPause={song_paused}
                onTimeUpdate={timeUpdate}
                onEnded={base_on_the_playback}
            ></audio>
        </footer>

    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        control_lyric_comments_state: state.control_lyric_comments_state,
        now_playing_state: state.now_playing_state,
        playlist_state: state.playlist_state,
        current_userinfo_state: state.current_userinfo_state

    }), {
    //发送action
    control_lyric_comments, control_playlist, now_playing, update_userinfo,sync_timeupdate,action_animation,stop_animation
}
)(UI)