import React, { useState } from "react";

export default function JoinChanInput(props: {joinChan: (value : string, password : string | null) => void, publicChans: string[]}) {
    const [value, setValue] = useState("");
    const [password, setPass] = useState("");
    //TO DO : add password field + auto select 1st option if exist

    if (props.publicChans.length > 0) {
        setValue(props.publicChans[0]);
    }
    return (
        <>
            <select onChange={(e) =>setValue(e.target.value)}>
            {props.publicChans.map(arrayChan => <option value={arrayChan}>{arrayChan}</option>)}
            </select>
            <input
                onChange={(e) => setValue(e.target.value)}
                placeholder="select channel"
                value={value}
            />
            <input
                onChange={(e) => setPass(e.target.value)}
                placeholder="password"
                value={password}
            />
            <button onClick={() => props.joinChan(value, password)}>Join Channel</button>
        </>
    )
}