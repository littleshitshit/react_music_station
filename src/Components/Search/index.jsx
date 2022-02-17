import { connect } from 'react-redux'
import { add_playlist ,control_search} from '../../Redux/Action'
const UI = (props) => {
    //------------------处理添加音乐item
    const process_add_playlist=(item)=>{
        props.add_playlist(item)
        props.control_search(true)
    }
    return (
        <div id='search' style={{ display: props.control_search_state ? 'block' : 'none' }}>
            {
                props.send_search_rs_state.map((item) => {
                    return (
                        <div className='search_result' key={item.song_id}
                            onClick={() => process_add_playlist(item.song_id)}
                        >
                            <p>{item.song_name}---{item.singer_name}</p>
                        </div>
                    )
                })
            }

        </div>
    )
}
export default connect(
    state => ({
        //接收reducer返回的state
        send_search_rs_state: state.send_search_rs_state,
        control_search_state: state.control_search_state
    }), {
    //发送action
    add_playlist,control_search
}
)(UI)