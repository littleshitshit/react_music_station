import { connect } from 'react-redux'
import React, { useRef } from 'react'
import { current_userinfo } from '../../../Redux/Action'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
const UI = (props) => {
    const login_username = useRef();
    const login_password = useRef();
    const login_img = useRef();
    const navigate = useNavigate()
    const register = () => {


        let reader = new FileReader();
        reader.readAsDataURL(login_img.current.files[0]);
        reader.onload = function (ev) { //文件读取成功完成时触发
            let dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
            const data = {
                username: login_username.current.value,
                password: login_password.current.value,
                user_img: dataURL
            }
            axios.post('http://127.0.0.1:8080/api/register', data).then((v) => {
                if (v.data.status === 0) {
                    window.alert(v.data.message)
                } else {
                    //注册失败返回错误信息
                    window.alert(v.data.message)

                }
            })
        }
    }
    return (
        <div id='register'>
            <input ref={login_img} type="file" accept="image/x-png,image/gif,image/jpeg,image/bmp" />
            <input ref={login_username} type="text" name='username' placeholder='用户名' />
            <input ref={login_password} type="password" name='username' placeholder='密码' />
            <button onClick={register}>注册</button>
            <Link to='../login'>注册好了？赶快登录吧！</Link>
        </div>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
    }), {
    //发送action
}
)(UI)