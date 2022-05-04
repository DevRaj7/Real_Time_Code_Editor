import React,{useState,useRef,useEffect} from 'react'
import Client from '../components/Client';
import ACTIONS from "../Actions";
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { initSocket } from '../socket';
import {useLocation,useNavigate,Navigate,useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Editor from '../components/Editor';
const EditorPage = () => {
   
  const socketRef=useRef(null);
  const codeRef=useRef(null);
  const location=useLocation();
  const  reactNavigate=useNavigate();
  const [clients,setClients]=useState([]);
  const {roomId}=useParams();
  const init=async()=>{
    socketRef.current=await initSocket();
    socketRef.current.on('connect_error',(err)=>handleErrors(err));
    socketRef.current.on('connect_failed',(err)=>handleErrors(err));
    function handleErrors(e){
      console.log('socket error');
      toast.error('socket connection failed,try again later');
      reactNavigate('/');
    }
  
    socketRef.current.emit(ACTIONS.JOIN,{
      roomId,
      userName: location.state?.userName,
    });
    //listening for joined event
        socketRef.current.on(ACTIONS.JOINED,({clients,userName,socketId})=>{
             if(userName!==location.state.userName){
               toast.success(`${userName} joined the romm`);
               console.log(`${userName} joined`);
             }
             setClients(clients);
             socketRef.current.emit(ACTIONS.SYNC_CODE,{
               code: codeRef.current,
               socketId,
             });
  
        });
        //listening for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,userName})=>{
            toast.success(`${userName} left the room`);
            setClients((prev)=>{
              return prev.filter(client=>client.socketId!==socketId);
            });
        });
  };
  useEffect(()=>{

init();
  return ()=>{
    socketRef.current.disconnect();
    socketRef.current.off(ACTIONS.JOINED);
    socketRef.current.off(ACTIONS.DISCONNECTED);

  }
  },[]);

  async function copyRoomid(){
    try{
     await navigator.clipboard.writeText(roomId);
     toast.success('Room Id copied to clipbaord');
    }catch(err){
          toast.error('Could not copy room Id');
          console.log(err);
    }
  }
  function leaveRoom(){
    reactNavigate('/');
  }
if(!location.state)
{
return <Navigate to="/" />
}

  return <div className='mainwrap'>
    <div className='aside'>
      <div className='asideInner'>
        <div className='logo'><img className='editorpagelogo' src="/images/11111.png" alt='code-sync-logo'></img><h3>Connected</h3>
        <div className='clientsList'>
          {
            clients.map((client)=>(

          <Client key={client.socketId}userName={client.userName} />
            )) }
        </div>
        </div>
      </div>
      <button className='btn copyBtn' onClick={copyRoomid}>Copy RoomId</button>
      <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
    </div>
    
    <div className='editorwrap'>
    
    <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
       codeRef.current=code;
     }}
     />
    </div>
    </div>
  
};

export default EditorPage