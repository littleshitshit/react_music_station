import { connect } from 'react-redux'
import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { override_playlist } from '../../../Redux/Action'
import '../../../Css/FM_recommend/FM_recommend.css'
const UI = (props) => {
    //---------------------------页面加载获取轮播图
    const wrapper = useRef()
    const [imgs_storage, setImgs_storage] = useState([]);
    const [imgs, setImgs] = useState([]); //图片数组
    useEffect(() => {
        axios.get('http://127.0.0.1:8080/api/getSwiper').then((v) => {
            if (v.data.status === 0) {
                setImgs_storage(v.data.data.rows)
                //设置轮播图数组
                setImgs(wrapper.current.children)
            }
        })
    }, [])
    //------------------------------设置无限轮播效果
    const [slideshow_button, setSlideshow_button] = useState(false);//控制按钮显示
    //节流锁
    const [leftLock, setLeftLock] = useState(true);
    const [rightLock, setRightLock] = useState(true);
    const swiper_left = () => {
        if (!leftLock) return
        setLeftLock(false)
        imgs[0].style.marginLeft = "-333px"
        imgs[1].style.transform = "scale(1)"
        imgs[1].style.zIndex = "0"
        imgs[1].style.filter = "blur(1px)"
        imgs[2].style.transform = "scale(1.3)"
        imgs[2].style.zIndex = "1"
        imgs[2].style.filter = "blur(0px)"
        setTimeout(() => {
            setLeftLock(true)
            imgs[0].style.marginLeft = "0px"
            let save_first = wrapper.current.removeChild(imgs[0])
            wrapper.current.append(save_first)
        }, 500);

    }
    const swiper_right = () => {
        if (!rightLock) return
        setRightLock(false)
        let save_last = wrapper.current.removeChild(imgs[imgs.length - 1])
        wrapper.current.prepend(save_last)
        imgs[0].style.marginLeft = "-333px"
        setTimeout(() => {
            imgs[0].style.marginLeft = "0px"
            imgs[1].style.transform = "scale(1.3)"
            imgs[1].style.zIndex = "1"
            imgs[1].style.filter = "blur(0px)"
            imgs[2].style.transform = "scale(1)"
            imgs[2].style.zIndex = "0"
            imgs[2].style.filter = "blur(1px)"
            setTimeout(() => {
                setRightLock(true)
            }, 500);
        }, 0);


    }
    //------------------------------页面加载获取歌单20个
    const [songlist_arr, setSonglist_arr] = useState([])// 初始化推荐歌单页面
    useEffect(() => {
        axios.get('http://127.0.0.1:8080/api/getSonglist/0/20').then((v) => {
            setSonglist_arr(v.data.data.rows);
        })
    }, [])
    //表单播放按钮pop
    const button_pop = (e, flag) => {
        flag ? e.target.nextElementSibling.style.opacity = "1" : e.target.nextElementSibling.style.opacity = "0"
    }
    //表单播放按钮悬停
    const but_hold = (e) => {
        e.target.style.opacity = "1"
    }
    //-------------------------------处理歌单数组并发送给播放列表
    const process_override_playlist = (e, songlist_string) => {
        props.override_playlist(songlist_string)
        
    }
    return (
        <>
            <div id='swiper' onMouseEnter={() => setSlideshow_button(true)}
                onMouseLeave={() => setSlideshow_button(false)}>
                <div id="wrapper" ref={wrapper} >
                    {
                        imgs_storage.map((item) => {
                            return (
                                <img src={item.swiper_img} key={item.swiper_id} />
                            )
                        })
                    }
                </div>
                <button style={{ display: slideshow_button ? 'block' : 'none' }} id='slide_left' onClick={swiper_left} ></button>
                <button style={{ display: slideshow_button ? 'block' : 'none' }} id='slide_right' onClick={swiper_right}></button>
            </div>
            <div id='fm_recommend'>
                <div className='rec_tab'>推荐歌单</div>
                <div className='rec_list'>
                    {
                        songlist_arr.map(item => {
                            return (
                                <div className='rec_item' key={item.songlist_id}>
                                    <img src={item.songlist_img}
                                        onMouseLeave={(e) => button_pop(e, false)}
                                        onMouseEnter={(e) => button_pop(e, true)} />
                                    <button
                                        onMouseOver={but_hold}
                                        onClick={(e) => process_override_playlist(e, item.songlist_arr)}
                                    ></button>
                                    <p>{item.songlist_title}</p>
                                </div>
                            )
                        })

                    }

                </div>
            </div>
        </>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
    }), {
    //发送action
    override_playlist
}
)(UI)