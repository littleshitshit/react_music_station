import { connect } from 'react-redux'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    control_search,
    send_search_rs,
    send_searchRs_keyword,
    control_userinfo,
} from '../../Redux/Action'
import axios from 'axios'

const UI = (props) => {
    const [keyword, setKeyword] = useState('');
    //----------------------节流搜索
    //节流锁
    const [inputLock, setInputLock] = useState(true)
    const header_debounce = (e) => {
        setKeyword(e.target.value)
        //组织频繁发送请求
        setInputLock(false)
        if (!inputLock) return;
        //发送请求
        setTimeout(() => {
            setInputLock(true)
            const data = {
                keyword: e.target.value,
                limit: "5",
                offset: "0"
            }
            axios.post('http://127.0.0.1:8080/api/search', data).then((v) => {
                console.log("500毫秒到了，发送搜索请求");
                //获取到数据,将数据发送给Search组件
                if (v.data.status === 0) {
                    props.send_search_rs(v.data.data.rows)
                }
            })
        }, 500);
    }
    //----------------------跳转搜索结果组件
    const navigate = useNavigate()
    const header_navigator_search = () => {
        console.log("传递关键字");
        navigate('/search_rs');
        props.send_searchRs_keyword(keyword)
    }
    //-------------------判断用户的登陆状态
    const judge_the_user = () => {
        //获取用户信息状态
        let Token = window.localStorage.getItem('Token')
        // console.log(Token);
        axios.get('http://127.0.0.1:8080/my/userinfo', {
            headers: {
                'Authorization': Token
            }
        }).then((v) => {
            //为登陆者
            if (v.data.status === 0) {
                console.log("用户");
                props.control_userinfo()
            } else {
                //为访客，切换注册路由
                console.log("访客");
                navigate('/login_register');
            }

        })
    }
    //------------------------对搜索弹窗的小处理
    const blur_search = () => {
        setTimeout(() => {
            props.control_search(false)
        }, 500);
    }
    return (
        <header>
            <div id="header_logo">基于React的音乐管理系统</div>
            <div id="header_search">
                <button onClick={header_navigator_search} />
                <input type="text" placeholder="请输入歌曲名关键字" onInput={header_debounce}
                    // 控制搜索框的pop
                    onFocus={() => props.control_search(true)}
                    onBlur={blur_search}
                />
            </div>
            {/* 跟据当前用户信息响应 */}
            <div id="header_login_register" onClick={judge_the_user}>
                <div className='user_img'><img src={props.current_userinfo_state.user_img} alt="" /></div>
                <span className='user_name'>{props.current_userinfo_state.username}</span>
            </div>

        </header>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        current_userinfo_state: state.current_userinfo_state
    }), {
    //发送action
    control_search,
    //  control_login,
    send_search_rs, send_searchRs_keyword,
    control_userinfo
}
)(UI)