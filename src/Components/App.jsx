import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import { current_userinfo } from '../Redux/Action'
import axios from 'axios'
import Header from './Header'
import Nav from './Nav'
import Article from './Article'
import Footer from './Footer'
import Lyric_comments from './Lyric_comments'
import Search from './Search'
import Playlist from './Playlist'
import Userinfo from './UserInfo'
import '../Css/App/App.css'
const UI = (props) => {
    //-------------------------更新用户数据（刷新页面也会）
    useEffect(() => {
        let Token = window.localStorage.getItem('Token');
        if(!Token) return
        axios.get('http://127.0.0.1:8080/my/userinfo', {
            headers: {
                'Authorization': Token
            }
        }).then((v) => {
            //为登陆者，更新页面
            if (v.data.status === 0) {
                console.log('更新当前用户信息,current_userinfo');
                props.current_userinfo(v.data.data.rows[0])
            }
        })
    }, [props.update_userinfo]);
    
    return (
        <>
            <Header />
            <Nav />
            <Article />
            <Footer />
            <Lyric_comments/>
            <Playlist/>
            <Search />
            <Userinfo/>
        </>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        //是否同步用户信息
        update_userinfo: state.update_userinfo
    }), {
    //发送action
    //发送当前用户信息
    current_userinfo
}
)(UI)
