import React,{useState} from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate=useNavigate();
    const [roomId,setRoomId]=useState('');
    const [userName,setUserName]=useState('');
    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uuidv4();
       
        setRoomId(id);
        
         toast.success('Created New Room');
    };
    const joinroom=()=>{
        if(!roomId||!userName)
        {
        toast.error('ROOM ID & Username required !');
        return;
        }
    navigate(`/editor/${roomId}`,{
        state:{ 
            userName,
        }
    });
};
const handleinputenter=(e)=>{
    if(e.code==='Enter'){
        joinroom();
    }
};
  return ( 

  <div className="HomePageWrapper">
            
         <div className='formwrapper'>
              <img className='homepagelogo' src="/images/11111.png" alt='code-sync-logo'></img>
              <h4 className='mainLabel'>Paste Invitation Room Id</h4>
                <div className='inputGroup'>
                    <input type="text" className='inputBox' placeholder='ROOM ID' onChange={(e)=>setRoomId(e.target.value)}  value={roomId} onKeyUp={handleinputenter}></input>
                    <input className='inputBox' placeholder='USERNAME'onChange={(e)=>setUserName(e.target.value)} value={userName} onKeyUp={handleinputenter}></input>
                    <button className='btn joinbtn' onClick={joinroom}>Join</button>
                    <span className='createInfo'>If you don't have an invite then create &nbsp;<a onClick={createNewRoom} href='' className='CreateNewbtn'>New Room</a></span>
                </div>
             </div>
             <div>
            
             </div>
             <footer>
                 <h4> Built by &nbsp; <a href='https://github.com/DevRaj7'>Dev Thakur</a> </h4>
             </footer>

  </div> 
  
  );
};

export default Home