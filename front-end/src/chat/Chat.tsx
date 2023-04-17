import React, { useEffect, useState } from 'react'
import { getToken, url } from '../api/Api'
import io, { Socket } from 'socket.io-client'
import Error from './Error'
import MessageInput from './MessageInput'
import CreateChanInput from './CreateChanInput'
import JoinChanInput from './JoinChanInput'
import ToggleChanInput from './ToggleChanInput'
import Message from './Message'

let activeChan: string = '';
let chans : Map<string, string[]> = new Map<string, string[]>()

function Chat() {
  const [socket, setSocket] = useState<Socket>();
  const [publicChanList, setPublicChan] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [errorToShow, setErrorToShow] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const WebChat = url + '/chat'
  
  const send = (value: string) => {
    setErrorToShow(false);
    socket?.emit("msgToServer", {author: socket?.id, chan: activeChan, msg: value});
  }

  const createChan = (title: string, isPrivate: boolean, password: string | undefined) => {
    console.log("create chan pressed");
    if (chans.get(title) !== undefined)
      return;
    let data = {title: title, isPrivate: isPrivate, password: password};
    socket?.emit("createChan", data);
  }

  const joinChan = (value: string, password: string | null) => {
    if (chans.get(value) !== undefined)
      return;
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
    setErrorToShow(true);
    setError(error);
  }

  const inviteListener = (chan : string) => {
    setErrorToShow(true);
    setError("You have been invited in channel : " + chan + " !\nIt is now visible in Join chan section.");
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
      {" "}
      <Error isShown={errorToShow} error={error} close={setErrorToShow}/>
      <ToggleChanInput toggleChan={toggleChan} leaveChan={leaveChan} chans={chans}/>
      <JoinChanInput joinChan={joinChan} publicChans={publicChanList}/>
      <CreateChanInput createChan={createChan}/>
      <MessageInput send={send}/>
      <Message messages = {messages}/>
    </>
  )
}

export default Chat
