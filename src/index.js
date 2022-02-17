import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import { Provider } from 'react-redux'
import store from './Redux/Store'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SearchRs from './Components/SearchRs'
import Login_register from './Components/Login_register'
import Login from './Components/Login_register/Login'
import Register from './Components/Login_register/Register'
import Find_music from './Components/Find_music'
import FM_recommend from './Components/Find_music/Fm_recommend'
import Myfavourite from './Components/Myfavourite'
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path='search_rs' element={<SearchRs />} />
          <Route path='my_favourite' element={<Myfavourite />} />
          <Route path='login_register' element={<Login_register />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route index element={<Navigate to="login" />} />
          </Route>
          <Route path='find_music' element={<Find_music />}>
            <Route path="fm_recommend" element={<FM_recommend />} />
            <Route index element={<Navigate to="fm_recommend" />} />

          </Route>
          <Route index element={<Navigate to="find_music" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);


