- 整体布局采用grid

- 默认字体大小为`16px`

- 默认字体颜色为`#a3a3a3`

- 更改了滚动条样式

  ```scss
  ::-webkit-scrollbar {
          width: 5px;
      }
  ::-webkit-scrollbar-thumb {
      background: #444444;
  }
  ```

- 最小宽度为1200px

- 全局背景色：`#2b2b2b`

# Redux状态管理

- send_search_rs_state：发送结果到search组件
  - song_id
  - song_name
  - song_time
  - **song_like**
  - singer_name
  - song_img
- send_searchRs_keyword_state：发送keyword到searchRs组件
- playlist_state:当前播放列表数组
  - [{}]
    - song_id
    - song_name
    - song_time
    - **song_like**
    - singer_name
    - song_img
- now_playing_state：当前正在播放歌曲信息
  - song_id
  - song_name
  - song_time
  - **song_like**
  - singer_name
  - song_img
- current_userinfo_state:当前用户信息
  - user_id
  - username
  - user_img
  - **user_like** 

# 播放逻辑

- 监测now_playing的改变，改变了就自动播放
  - 如果当前没有播放源就return
  - 自动播放时获取当前索引，用于歌曲的切换
- 添加歌曲会在头添加，监测playlist的改变，改变了就将nowplaying设置为第一个元素
