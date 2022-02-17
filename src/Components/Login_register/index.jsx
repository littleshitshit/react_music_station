import {connect} from 'react-redux'
import { Outlet } from 'react-router-dom'

import '../../Css/Login_register/Login_register.css'
const UI=(props)=>{
    return (
        <div id='login_register'>
            <Outlet/>
        </div>
    )
}
export default connect(
    state=>({
        //接收reducer返回的state
    }),{
        //发送action
    }
)(UI)