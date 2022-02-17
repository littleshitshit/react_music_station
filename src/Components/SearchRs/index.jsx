import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import '../../Css/searchRs/searchRs.css'
import axios from 'axios'
import { add_playlist, now_playing } from '../../Redux/Action'

const UI = (props) => {

    //----------------当搜索词改变后，也跟着刷新,每次改变offset必须为0(全体更新)
    //存储搜索结果,用于展示页面
    const [searchRs, setSearchRs] = useState([]);
    //存储搜索长度,用于分页
    const [searchLen, setSearchLen] = useState(0)
    useEffect(() => {
        const data = {
            keyword: props.send_searchRs_keyword_state,
            limit: "1",//每页限定的搜索数
            offset: "0"//每次搜索都从头开始
        }
        axios.post('http://127.0.0.1:8080/api/search', data).then((v) => {
            if (v.data.status === 0) {
                // setOffset(0)
                //获取搜索结果个数,用于分页逻辑
                axios.post('http://127.0.0.1:8080/api/searchLen', data).then((v) => {
                    setSearchLen(v.data.data.rows[0].len);
                })
                //设置搜索结果
                setSearchRs(v.data.data.rows);
            } else {
                setSearchRs([])
            }
        })


    }, [props.send_searchRs_keyword_state]);
    //------------------------分页效果(局部更新)
    //更改offset
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        const data = {
            keyword: props.send_searchRs_keyword_state,
            limit: "1",
            offset: `${offset}`
        }
        axios.post('http://127.0.0.1:8080/api/search', data).then((v) => {
            if (v.data.status === 0) {
                setSearchRs(v.data.data.rows);
            } else {
                setSearchRs([])
            }
        })
    }, [offset]);
    const move_page = () => {
        if (offset < searchLen - 1) {
            setOffset(offset + 1)
        }
    }
    const move_back_page = () => {
        if (offset > 0) {
            setOffset(offset - 1)
        }
    }
    //------------------处理添加音乐item
    const process_add_playlist = (item) => {
        props.add_playlist(item)
        
    }
    return (
        <div id='searchRs'>
            {
                searchRs.map((item, index) => {
                    return (
                        <div id='searchRs_item' key={item.song_id}
                            onDoubleClick={() => process_add_playlist(item.song_id)}
                        >
                            <span className='item_song_index'>{index}</span>
                            <span className='item_song_like' style={{ backgroundPositionY: Number(item.song_like) ? '-530px' : '-501px' }}></span>
                            <span className='item_song_name'>{item.song_name}</span>
                            <span className='item_singer_name'>{item.singer_name}</span>
                            <span className='item_music_time'>{item.song_time}</span>
                        </div>
                    )
                })
            }
            <div id='searchRs_bottom'>
                <button onClick={move_back_page}>上一页</button>
                <p>{offset + 1}</p>
                <button onClick={move_page}>下一页</button>
            </div>

        </div>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        send_searchRs_keyword_state: state.send_searchRs_keyword_state,

    }), {
    //发送action
    add_playlist, now_playing
}
)(UI)