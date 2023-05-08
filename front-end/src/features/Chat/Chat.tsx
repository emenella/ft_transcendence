import React, { useEffect, useState, useContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import toast from 'react-hot-toast';
import Matchmaking from '../Game/Matchmaking';
import Profile from '../Profile/Profile';
import { Navigate } from 'react-router-dom';
import AccountManagement from '../Profile/AccountManagement';
import '../Structure/Body_connected.css'
import { getJwtCookie, socket, url } from '../../api/JwtCookie'
import io, { Socket } from 'socket.io-client'
import MessageInput from './MessageInput'
import CreateChanInput from './CreateChanInput'
import JoinChanInput from './JoinChanInput'
import ToggleChanInput from './ToggleChanInput'
import Message from './Message'
import { msg } from './interfaceChat';
import Spectate from '../Game/Spec';
import { UserContext } from '../../utils/UserContext';
import { SocketContext } from '../../utils/SocketContext';
import { SockEvent } from '../../utils/backendInterface';
import SignUp  from '../../auth/SignUp';
import { Enable2FA } from '../../auth/2FA';

let activeChan: string = '';
let channels : Map<string, msg[]> = new Map<string,msg[]>();

function Chat() {
  const userContext = useContext(UserContext);
	const user = userContext?.user;

  const socketChat = useContext(SocketContext);
  const [publicChanList, setPublicChan] = useState<string[]>([]);
  const [msgs, setMsgs] = useState<msg[]>([]);

  const WebChat = url + '/chat'

  const send = (value: string) => {
    socketChat?.emit(SockEvent.SE_CH_MSG, {chan: activeChan, msg: value});
  }

  const createChan = (title: string, isPrivate: boolean, password: string | undefined) => {
    let data = {title: title, isPrivate: isPrivate, password: password};
    socketChat?.emit(SockEvent.SE_CH_CREATE, data);
  }

  const joinChan = (value: string, password: string | null) => {
    if (password === "") {
      password = null;
    }
    socketChat?.emit(SockEvent.SE_CH_JOIN, {chan: value, password: password});
  }

  const toggleChan = (value: string) => {
    if (channels.get(value) !== undefined) {
      activeChan = value;
      setMsgs(channels.get(activeChan) as msg[]);
    }
  }

  const leaveChan = (chan: string) => {
    if (channels.get(chan) !== undefined) {
      socketChat?.emit(SockEvent.SE_CH_LEAVE, chan);
    }
  }

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
    channels.delete(chan);
    if (activeChan === chan && channels.size > 0) {
      for (let [key, msg] of channels.entries()) {
        activeChan = key;
        setMsgs(channels.get(activeChan) as msg[]);
        return;
      }
    }
    if (channels.size === 0) {
      activeChan = '';
      setMsgs([]);
    }
  }

  const messageListener = (data: {date: string, authorId: number, author: string, chan: string, msg: string}) => {
    for (let usr of user!.blacklist) {
      if (usr.username === data.author) {
        return;
      }
    }
    let chanMessages : msg[] = channels.get(data.chan) as msg[];
    if (chanMessages === undefined)
      chanMessages = [];
    let message : msg = {date: data.date, authorId: data.authorId, author: data.author, content: data.msg};
    channels.set(data.chan, [...chanMessages, ...[message]]);
    if (activeChan === data.chan) {
      setMsgs(channels.get(activeChan) as msg[]);
    }
  }

  const createChanListener = (chan: string) => {
    activeChan = chan;
    channels.set(chan, []);
    setMsgs([]);
  }

  const joinChanListener = (data : {chan: string, messages: msg[]}) => {
    activeChan = data.chan;
    let filtredMessage : msg[] = [];
    for (let msg of data.messages) {
      let check : boolean = true;
      for (let usr of user!.blacklist) {
        if (usr.username === msg.author) {
          check = false;
        }
      }
      if (check)
        filtredMessage.push(msg);
    }
    data.messages = filtredMessage;

    if (channels.get(data.chan) !== undefined) {
      setMsgs(channels.get(data.chan) as msg[]);
      return;
    }
    channels.set(data.chan, data.messages);
    setMsgs(channels.get(data.chan) as msg[]);
  }

  const leftChanListener = (chan : string) => {
    channels.delete(chan);
    if (activeChan === chan && channels.size > 0) {
      for (let [key, msg] of channels.entries()) {
        activeChan = key;
        setMsgs(channels.get(activeChan) as msg[]);
        return;
      }
    }
    if (channels.size === 0) {
      activeChan = '';
      setMsgs([]);
    }
  }

  const refreshListListener = (chans: string[]) => {
    setPublicChan(chans);
  }

  useEffect(() => {
    socketChat?.on("error", errorListener);
    return () => {
      socketChat?.off("error", errorListener);
    }
  }, [errorListener])

  useEffect(() => {
    socketChat?.on("msgToClient", messageListener);
    return () => {
      socketChat?.off("msgToClient", messageListener);
    }
  }, [messageListener])

  useEffect(() => {
    socketChat?.on("createdChan", createChanListener);
    return () => {
      socketChat?.off("createdChan", createChanListener);
    }
  }, [createChanListener])

  useEffect(() => {
    socketChat?.on("joinedChan", joinChanListener);
    return () => {
      socketChat?.off("joinedChan", joinChanListener);
    }
  }, [joinChanListener])

  useEffect(() => {
    socketChat?.on("leftChan", leftChanListener);
    return () => {
      socketChat?.off("leftChan", leftChanListener);
    }
  }, [leftChanListener])

  useEffect(() => {
    socketChat?.on("invited", inviteListener);
    return () => {
      socketChat?.off("invited", inviteListener);
    }
  }, [inviteListener])

  useEffect(() => {
    socketChat?.on("ban", banListener);
    return () => {
      socketChat?.off("ban", banListener);
    }
  }, [banListener])

  useEffect(() => {
    socketChat?.on("listOfChan", refreshListListener);
    return () => {
      socketChat?.off("listOfChan", refreshListListener);
    }
  }, [refreshListListener])

  return (
      <div className='w-4/5 h-2/5 rounded-2xl border border-teal-600 bg-teal-50 ml-1 mr-5 grid grid-cols-2'>
        <div>
          <div className='text-center mt-10 mb-10'>
            <label className='text-lg font-bold'>- Select Chan Menu -</label>
            <ToggleChanInput toggleChan={toggleChan} leaveChan={leaveChan} chans={channels} activeChan={activeChan}/>
          </div>
          <div className='text-center mt-10 mb-10'>
            <label className='text-lg font-bold'>- Join Chan Menu -</label>
            <JoinChanInput joinChan={joinChan} publicChans={publicChanList}/>
          </div>
          <div className='text-center mt-10 mb-10'>
            <label className='text-lg font-bold'>- Create Chan Menu -</label>
            <CreateChanInput createChan={createChan}/>
          </div>
        </div>
        <div className='border-l border-teal-600 relative h-full'>
          <div className='font-bold ml-1 mt-0.5'>{activeChan}</div>
            <div className='ml-1 mt-0.5 mb-0.5 overflow-y-scroll'>
              <Message messages = {msgs}/>
            </div>
          <div className='absolute bottom-0 left-0'>
            <div className='ml-1 mt-0.5 mb-0.5'>
              <MessageInput send={send} activeChan={activeChan}/>
            </div>
          </div>
        </div>
      </div>
  )
}  

export default Chat
