import { useState } from 'react'
import { NavLink } from 'react-router-dom';
export default () => {
    const [first_nav] = useState([
        { first_nav_id: 1, first_nav_name: "发现音乐", first_nav_route: "find_music" },
        { first_nav_id: 2, first_nav_name: "博客", first_nav_route: "blog" },
        { first_nav_id: 3, first_nav_name: "视频", first_nav_route: "movie" },
        { first_nav_id: 4, first_nav_name: "关注", first_nav_route: "following" },
        { first_nav_id: 5, first_nav_name: "直播", first_nav_route: "live" },
        { first_nav_id: 6, first_nav_name: "私人FM", first_nav_route: "fm" }
    ])
    return (
        <nav>
            {
                first_nav.map((item) => <NavLink style={({ isActive }) => ({ backgroundColor: isActive ? 'rgb(51,51,51)' : '', color: isActive ? 'white' : '' })} key={item.first_nav_id} to={item.first_nav_route}>{item.first_nav_name}</NavLink>)
            }
            <p>我的音乐</p>
            <NavLink style={({ isActive }) => ({ backgroundColor: isActive ? 'rgb(51,51,51)' : '', color: isActive ? 'white' : '' })} to="my_favourite">我的收藏</NavLink>
        </nav>
    )
}
