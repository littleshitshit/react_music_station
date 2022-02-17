import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import '../../Css/Find_music/Find_music.css'
export default () => {
    //---------------------二级菜单功能开启
    const [second_nav, setSecond_nav] = useState([
        { second_nav_id: 1, second_nav_name: "个性推荐", second_nav_route: "fm_recommend" },
        { second_nav_id: 2, second_nav_name: "歌单", second_nav_route: "fm_songlist" },
        { second_nav_id: 3, second_nav_name: "排行榜", second_nav_route: "fm_rank" },
        { second_nav_id: 4, second_nav_name: "歌手", second_nav_route: "fm_singer" },
        { second_nav_id: 5, second_nav_name: "最新音乐", second_nav_route: "fm_news_music" }
    ])
    //----------------------navlink样式
    const my_NavLink = (e) => {
        if (window.getComputedStyle(e.target).color === "rgb(163, 163, 163)") {
            let items = document.querySelectorAll('.second_nav_item');
            for (let i of items) {
                i.lastElementChild.firstElementChild.style.width = '3px'
            }
            e.target.nextElementSibling.firstElementChild.style.width = "95%"
        }
    }
    
    return (
        <div id='find_music'>
            <div className='second_nav_wrapper'>
                {
                    second_nav.map((item) => {
                        return (
                            <div className='second_nav_item' key={item.second_nav_id}>
                                <NavLink onClick={my_NavLink}
                                    style={({ isActive }) => ({color: isActive ? 'white' : '',borderBottomWidth: isActive ? '2px' : '0px'})}
                                    to={item.second_nav_route}>{item.second_nav_name}</NavLink>
                            </div>
                        )
                    })
                }
            </div>
            <Outlet />
        </div>
    )
}
