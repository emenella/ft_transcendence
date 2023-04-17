import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import toast from 'react-hot-toast';
import Matchmaking from '../components/Game/Matchmaking';
import Profil from '../components/Profil';
import AccountManagement from '../components/AccountManagement';
import '../components/Body_connected.css'
import { getToken, url } from '../api/Api'
import io, { Socket } from 'socket.io-client'
import MessageInput from './MessageInput'
import CreateChanInput from './CreateChanInput'
import JoinChanInput from './JoinChanInput'
import ToggleChanInput from './ToggleChanInput'
import Message from './Message'
import { User } from '../utils/backend_interface';

let activeChan: string = '';
let chans : Map<string, string[]> = new Map<string, string[]>()

function Chat(props : {user: User | undefined}) {
  const [socket, setSocket] = useState<Socket>();
  const [publicChanList, setPublicChan] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);

  const WebChat = url + '/chat'
  
  const send = (value: string) => {
    socket?.emit("msgToServer", {author: socket?.id, chan: activeChan, msg: value});
  }

  const createChan = (title: string, isPrivate: boolean, password: string | undefined) => {
    let data = {title: title, isPrivate: isPrivate, password: password};
    socket?.emit("createChan", data);
  }

  const joinChan = (value: string, password: string | null) => {
    if (password === "") {
      password = null;
    }
    socket?.emit("joinChan", {chan: value, password: password});
  }

  const toggleChan = (value: string) => {
    if (chans.get(value) !== undefined) {
      activeChan = value;
      setMessages(chans.get(activeChan) as string[]);
    }
  }

  const leaveChan = (chan: string) => {
    if (chans.get(chan) !== undefined) {
      socket?.emit('leaveChan', chan);
    }
  }

  useEffect(() => {
    const newSocket = io(WebChat, { extraHeaders: { Authorization: getToken() as string } });
    setSocket(newSocket);
    console.log("useEffect Chat socket");
  }, [setSocket, WebChat])

  const errorListener = (error : string) => {
    toast.error(error);
  }

  const inviteListener = (chan : string) => {
    toast.success("You have been invited in channel : " + chan + " !\nIt is now visible in Join chan section.")
    if (publicChanList.findIndex((c) => { return c === chan}) === -1) {
      setPublicChan([...publicChanList, ...[chan]]);
    }
  }

  const banListener = (chan : string) => {
    chans.delete(chan);
    if (activeChan === chan && chans.size > 0) {
      for (let [key, msg] of chans.entries()) {
        activeChan = key;
        setMessages(chans.get(activeChan) as string[]);
        return;
      }
    }
    if (chans.size === 0) {
      activeChan = '';
      setMessages(['']);
    }
  }

  const messageListener = (data: {author: string, chan: string, msg: string}) => {
    let chanMessages : string[] = chans.get(data.chan) as string[];
    chans.set(data.chan, [...chanMessages, ...[data.author + ': ' + data.msg]]);
    if (activeChan === data.chan) {
      setMessages(chans.get(activeChan) as string[]);
    }
  }

  const createChanListener = (chan: string) => {
    activeChan = chan;
    chans.set(chan, [""]);
    setMessages(['']);
  }

  const joinChanListener = (data : {chan: string, messages: string[]}) => {
    activeChan = data.chan;

    if (chans.get(data.chan) !== undefined) {
      setMessages(chans.get(data.chan) as string[]);
      return;
    }
    chans.set(data.chan, data.messages);
    setMessages(chans.get(data.chan) as string[]);
  }

  const leftChanListener = (chan : string) => {
    chans.delete(chan);
    if (activeChan === chan && chans.size > 0) {
      for (let [key, msg] of chans.entries()) {
        activeChan = key;
        setMessages(chans.get(activeChan) as string[]);
        return;
      }
    }
    if (chans.size === 0) {
      activeChan = '';
      setMessages(['']);
    }
  }

  const refreshListListener = (chans: string[]) => {
    setPublicChan(chans);
  }

  useEffect(() => {
    socket?.on("error", errorListener);
    return () => {
      socket?.off("error", errorListener);
    }
  }, [errorListener])

  useEffect(() => {
    socket?.on("msgToClient", messageListener);
    return () => {
      socket?.off("msgToClient", messageListener);
    }
  }, [messageListener])

  useEffect(() => {
    socket?.on("createdChan", createChanListener);
    return () => {
      socket?.off("createdChan", createChanListener);
    }
  }, [createChanListener])

  useEffect(() => {
    socket?.on("joinedChan", joinChanListener);
    return () => {
      socket?.off("joinedChan", joinChanListener);
    }
  }, [joinChanListener])

  useEffect(() => {
    socket?.on("leftChan", leftChanListener);
    return () => {
      socket?.off("leftChan", leftChanListener);
    }
  }, [leftChanListener])

  useEffect(() => {
    socket?.on("invited", inviteListener);
    return () => {
      socket?.off("invited", inviteListener);
    }
  }, [inviteListener])

  useEffect(() => {
    socket?.on("ban", banListener);
    return () => {
      socket?.off("ban", banListener);
    }
  }, [banListener])

  useEffect(() => {
    socket?.on("listOfChan", refreshListListener);
    return () => {
      socket?.off("listOfChan", refreshListListener);
    }
  }, [refreshListListener])

  return (
    <>
      <div className='chatSidebar'>
        <div className='toggle&leaveChan'>
          <ToggleChanInput toggleChan={toggleChan} leaveChan={leaveChan} chans={chans}/>
        </div>
        <div className='joinChan'>
          <JoinChanInput joinChan={joinChan} publicChans={publicChanList}/>
        </div>
        <div className='createChan'>
          <CreateChanInput createChan={createChan}/>
        </div>
      </div>

      <div className="connectedCenter">
				<div>
					<Routes>
						<Route path="/" element={<Matchmaking />} />
						<Route path="/accountmanagement" element={<AccountManagement user={props.user!} />} />
						<Route path="/profil" element={<Profil id={props.user?.id!} />} />
					</Routes>
				</div>
        <div className='chat'>
          <label>{activeChan}
          <div className='messagesList'>
            <Message messages = {messages}/>
          </div>
          </label>
          <div className='inputMessage'>
            <MessageInput send={send}/>
          </div>
        </div>
			</div>
    </>
  )
}

export default Chat
