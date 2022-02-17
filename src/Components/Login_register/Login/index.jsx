import { connect } from 'react-redux'
import React, { useRef } from 'react'
import { current_userinfo ,update_userinfo} from '../../../Redux/Action'
import { useNavigate,Link } from 'react-router-dom'

import axios from 'axios';
const UI = (props) => {
    const login_username = useRef();
    const login_password = useRef();
    const navigate = useNavigate()

    const login = () => {
        const data = {
            username: login_username.current.value,
            password: login_password.current.value
        }
        axios.post('http://127.0.0.1:8080/api/login', data).then((v) => {
            if (v.data.status === 0) {
                //登陆成功，保存Token
                window.localStorage.setItem("Token", v.data.data.token)
                let Token = window.localStorage.getItem('Token');
                //访问用户信息
                axios.get('http://127.0.0.1:8080/my/userinfo', {
                    headers: {
                        'Authorization': Token
                    }
                }).then((v) => {
                    //刷新用户信息
                    props.update_userinfo()
                    //跳转回首页
                    navigate('/');
                })
            }else{
                //登录失败返回错误信息
                window.alert(v.data.message);
            }
        })
    }
    return (
        <div id='login'>
            <input ref={login_username} type="text" name='username' placeholder='用户名'/>
            <input ref={login_password} type="password" name='username' placeholder='密码'/>
            <button onClick={login}>登录</button>
            <Link to='../register'>还没有账号?赶快注册一个吧!</Link>
        </div>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
    }), {
    //发送action
    current_userinfo,update_userinfo
}
)(UI)