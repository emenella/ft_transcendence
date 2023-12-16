import React, { useEffect, useState, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../body/Body_connected.css'
import Matchmaking from '../game/Matchmaking';
import Profile from '../profile/Profile';
import AccountManagement from '../profile/AccountManagement';
import MessageInput from './MessageInput'
import CreateChanInput from './CreateChanInput'
import JoinChanInput from './JoinChanInput'
import ToggleChanInput from './ToggleChanInput'
import Message from './Message'
import { msg } from '../../utils/interfaceChat';
import { UserContext } from '../../utils/UserContext';
import { SocketContext } from '../../utils/SocketContext';
import { DuelButton } from '../profile/buttons/Buttons';
import { getUserByUsername } from '../../api/User.requests';


function Chat() {
    const [activeChan, setActiveChan] = useState<string>('');
    const [channels, setChannels] = useState<Map<string, msg[]>>(new Map<string, msg[]>());
    const userContext = useContext(UserContext);
    const user = userContext?.user;

    const socket = useContext(SocketContext);
    const [publicChanList, setPublicChan] = useState<string[]>([]);
    const [msgs, setMsgs] = useState<msg[]>([]);
    const [isDM, setIsDM] = useState<boolean>(false);
    const [dest, setDest] = useState<number | undefined>(undefined);

    const send = (value: string) => {
        socket?.emit("msgToServer", { chan: activeChan, msg: value });
    }

    const createChan = (title: string, isPrivate: boolean, password: string | undefined) => {
        let data = { title: title, isPrivate: isPrivate, password: password };
        socket?.emit("createChan", data);
    }

    const joinChan = (value: string, password: string | null) => {
        if (password === "") {
            password = null;
        }
        socket?.emit("joinChan", { chan: value, password: password });
    }

    const toggleChan = (value: string) => {
        if (channels.get(value) !== undefined) {
            setActiveChan(value);
            setMsgs(channels.get(value) as msg[]);
        }
    }

    const leaveChan = (chan: string) => {
        if (channels.get(chan) !== undefined) {
            socket?.emit('leaveChan', chan);
        }
    }

    useEffect(() => {
        const errorListener = (error: string) => {
            toast.error(error);
        }

        const inviteListener = (chan: string) => {
            toast.success("You have been invited in channel : " + chan + " !\nIt is now visible in Join chan section.")
            if (publicChanList.findIndex((c) => { return c === chan }) === -1) {
                setPublicChan([...publicChanList, ...[chan]]);
            }
        }

        const banListener = (chan: string) => {
            channels.delete(chan);
            if (activeChan === chan && channels.size > 0) {
                for (let [key] of channels.entries()) {
                    setActiveChan(key)
                    setMsgs(channels.get(key) as msg[]);
                    return;
                }
            }
            if (channels.size === 0) {
                setActiveChan('');
                setMsgs([]);
            }
        }

        const messageListener = (data: { date: string, authorId: number, author: string, chan: string, msg: string }) => {
            for (let usr of user!.blacklist) {
                const author = data.author.replace(/\[.*\]/, '').trim();
                if (usr.username === author) {
                    return;
                }
            }
            let chanMessages: msg[] = channels.get(data.chan) as msg[];
            if (chanMessages === undefined)
                chanMessages = [];
            let message: msg = { date: data.date, authorId: data.authorId, author: data.author, content: data.msg };
            setChannels(new Map(channels.set(data.chan, [...chanMessages, ...[message]])));
            if (activeChan === data.chan) {
                setMsgs(channels.get(activeChan) as msg[]);
            }
        }

        const createChanListener = (chan: string) => {
            setActiveChan(chan);
            channels.set(chan, []);
            setMsgs([]);
        }

        const joinChanListener = (data: { chan: string, messages: msg[] }) => {
            setActiveChan(data.chan);
            let filtredMessage: msg[] = [];
            for (let msg of data.messages) {
                let check: boolean = true;
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
            setChannels(new Map(channels.set(data.chan, data.messages)));
            setMsgs(channels.get(data.chan) as msg[]);
        }

        const leftChanListener = (chan: string) => {
            const map = new Map<string, msg[]>(channels);
            map.delete(chan);
            setChannels(map);
            if (activeChan === chan && map.size > 0) {
                for (let [key] of map.entries()) {
                    setActiveChan(key);
                    setMsgs(map.get(key) as msg[]);
                    return;
                }
            }
            if (map.size === 0) {
                setActiveChan('');
                setMsgs([]);
            }
        }

        const refreshListListener = (chans: string[]) => {
            setPublicChan(chans);
        }
        
        const getUser = async () =>
        {
            if (activeChan && activeChan[0] !== '#')
            {
                const user = await getUserByUsername(activeChan).catch((err) => { toast.error(err)});
                if (user)
                {
                    setIsDM(true);
                    setDest(user.id);
                }
            }
            else
            {
                setIsDM(false);
                setDest(undefined);
            }
        }

        getUser();
        socket?.on("error", errorListener);
        socket?.on("msgToClient", messageListener);
        socket?.on("createdChan", createChanListener);
        socket?.on("joinedChan", joinChanListener);
        socket?.on("leftChan", leftChanListener);
        socket?.on("invited", inviteListener);
        socket?.on("ban", banListener);
        socket?.on("listOfChan", refreshListListener);
        return () => {
            socket?.off("error", errorListener);
            socket?.off("msgToClient", messageListener);
            socket?.off("createdChan", createChanListener);
            socket?.off("joinedChan", joinChanListener);
            socket?.off("leftChan", leftChanListener);
            socket?.off("invited", inviteListener);
            socket?.off("ban", banListener);
            socket?.off("listOfChan", refreshListListener);
        }
    }, [socket, publicChanList, user, channels, activeChan])

    return (
        <>
            <div className='chatSidebar'>
                <div className='menuChan'>
                    <label>- Select Chan Menu -</label>
                    <ToggleChanInput toggleChan={toggleChan} leaveChan={leaveChan} chans={channels} activeChan={activeChan} />
                </div>
                <div className='menuChan'>
                    <label>- Join Chan Menu -</label>
                    <JoinChanInput joinChan={joinChan} publicChans={publicChanList} />
                </div>
                <div className='menuChan'>
                    <label>- Create Chan Menu -</label>
                    <CreateChanInput createChan={createChan} />
                </div>
            </div>

            <div className="connectedCenter">
                <div>
                    <SocketContext.Provider value={socket}>
                        <Routes>
                            <Route index element={<Matchmaking />}></Route>
                            <Route path="profile/:id" element={<Profile />} />
                            <Route path="accountmanagement" element={<AccountManagement />} />
                            <Route path="*" element={<Navigate to="/error" replace />} />
                        </Routes>
                    </SocketContext.Provider>
                </div>
                <div className='chat'>
                    <div className='chanTitle'>{activeChan}</div>
                    {isDM ? <DuelButton socket={socket} receiverId={dest}/> : <></>}
                    <Message messages={msgs} />
                    <MessageInput send={send} activeChan={activeChan} />
                </div>
            </div>
        </>
    )
}

export default Chat
