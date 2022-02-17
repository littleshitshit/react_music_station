import { connect } from 'react-redux'
import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios';
import { current_userinfo, update_userinfo ,control_userinfo} from '../../Redux/Action'

const UI = (props) => {
    const login_new_username = useRef();
    const login_new_password = useRef();
    const login_old_password = useRef();
    const login_new_img = useRef();
    //-------------------------更新用户头像
    const update_user_img = () => {
        let reader = new FileReader();
        let Token = window.localStorage.getItem('Token');
        reader.readAsDataURL(login_new_img.current.files[0]);
        reader.onload = function (ev) {
            let dataURL = ev.target.result;
            axios.post('http://127.0.0.1:8080/my/updateUserImg',
                {
                    user_img: dataURL
                }, {
                headers: {
                    'Authorization': Token
                }
            }).then((v) => {
                if (v.data.status === 0) {
                    console.log('头像更新成功')
                    //更新本地信息
                    props.update_userinfo()
                } else {
                    alert(v.data.message)
                }
            })
        }
    }
    //--------------------------更新用户名
    const update_username = () => {
        let Token = window.localStorage.getItem('Token');
        axios.post('http://127.0.0.1:8080/my/updateUsername',
            {
                username: login_new_username.current.value
            }, {
            headers: {
                'Authorization': Token
            }
        }).then((v) => {
            if (v.data.status === 0) {
                console.log('用户名更新成功');
                props.update_userinfo()

            } else {
                alert(v.data.message)
            }
        })
    }
    //---------------------------更新密码
    const update_password = () => {
        let Token = window.localStorage.getItem('Token');
        axios.post('http://127.0.0.1:8080/my/updateUserpwd',
            {
                old_password: login_old_password.current.value,
                new_password: login_new_password.current.value
            }, {
            headers: {
                'Authorization': Token
            }
        }).then((v) => {
            if (v.data.status === 0) {
                console.log('密码更新成功');
            } else {
                alert(v.data.message)
            }
        })
    }
    //---------------------------控制修改页面的pop
    const [update_pop, setUpdate_pop] = useState(props.control_userinfo_state)
    useEffect(() => {
        setUpdate_pop(props.control_userinfo_state)
    }, [props.control_userinfo_state]);
    const userinfo = useRef()
    const control_update_pop = () => {
        setUpdate_pop(!update_pop)
        if (update_pop) {
            userinfo.current.style.top = "70px";
        } else {
            userinfo.current.style.top = "-430px";
        }
    }
    //---------------------------退出
    const log_out = () => {
        axios.get('http://127.0.0.1:8080/my/logout', {
            headers: {
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then((v) => {
            if (v.data.status === 0) {
                window.localStorage.removeItem("Token");
                props.current_userinfo([{
                    user_id: 0,
                    username: '未登录',
                    user_img: '',
                    user_like: ''
                }])
                console.log("退出登录成功");
                props.control_userinfo()
            }else{
                alert(v.data.message)
            }
        })
    }
    return (
        <div id='userinfo' ref={userinfo} style={{ top: props.control_userinfo_state ? '-430px' : '-700px' }}>
            <div id='update_info'>
                <div id='update_wrapper'>
                    <p>更新头像</p>
                    <input ref={login_new_img} type="file" accept="image/x-png,image/gif,image/jpeg,image/bmp" />
                    <button onClick={update_user_img}>提交</button>
                </div>
                <div id='update_wrapper'>
                    <p>更新用户名</p>
                    <input ref={login_new_username} type="text" placeholder='请输入新用户名' />
                    <button onClick={update_username}>提交</button>
                </div>
                <div id='update_wrapper'>
                    <p>更新密码</p>
                    <input ref={login_old_password} type="password" placeholder='请输入旧密码'></input>
                    <input ref={login_new_password} type="password" placeholder='请输入新密码'></input>
                    <button onClick={update_password}>提交</button>
                </div>
            </div>
            <div id='info'>
                <img src={props.current_userinfo_state.user_img} alt="" />
                <span className='user_name'>{props.current_userinfo_state.username}</span>
                <button onClick={control_update_pop}>更新</button>
                <button onClick={log_out}>登出</button>
            </div>

        </div>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        control_userinfo_state: state.control_userinfo_state,
        current_userinfo_state: state.current_userinfo_state
    }), {
    //发送action
    update_userinfo, current_userinfo,control_userinfo
}
)(UI)