import React, { useEffect, useState } from "react";
import "./Message.css"

export default function JoinChanInput(props: { joinChan: (value: string, password: string | null) => void, publicChans: string[] }) {
    const [value, setValue] = useState("");
    const [password, setPass] = useState("");

    useEffect(() => {
        if (props.publicChans.length > 0) {
            setValue(props.publicChans[0]);
        }
    }, [props.publicChans])

    function resize(id: string, size: string) {
        const location = document.getElementById(id);
        if (location)
            location.style.width = size;
    }

    useEffect(() => {
        resize("selectJoin", "95%");
        resize("inputJoin", "90%");
        resize("inputPassJoin", "90%");
    })

    return (
        <div>
            <select
                className="nowrap"
                id="selectJoin"
                onChange={(e) => setValue(e.target.value)}
            >
                {props.publicChans.map((arrayChan, index) => <option key={index}>{arrayChan}</option>)}
            </select>
            <input
                className="nowrap"
                id="inputJoin"
                onChange={(e) => setValue(e.target.value)}
                placeholder="channel to join"
                value={value}
                maxLength={24}
            />
            <input
                type="password"
                id="inputPassJoin"
                onChange={(e) => setPass(e.target.value)}
                placeholder="password (optional)"
                value={password}
                maxLength={40}
            />
            <button className="button" onClick={() => props.joinChan(value, password)}>Join Channel</button>
        </div>
    )
}
