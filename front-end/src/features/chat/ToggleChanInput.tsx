import React, { useEffect, useState } from "react";
import "./Message.css"
import { msg } from "../../utils/interfaceChat";

export default function ToggleChanInput(props: { toggleChan: (value: string) => void, leaveChan: (chan: string) => void, chans: Map<string, msg[]>, activeChan: string }) {
    const [value, setValue] = useState(props.activeChan);

    const chanJoined: string[] = [];
    props.chans.forEach((c, k) => {
        chanJoined.push(k)
    });

    useEffect(() => {
        if (props.activeChan && chanJoined.length > 0) {
            setValue(props.activeChan);
        }
    }, [props.activeChan, chanJoined.length])

    function resize() {
        const location = document.getElementById("toggleChan");
        if (location)
            location.style.width = '90%';
    }

    useEffect(() => {
        resize();
    })

    return (
        <div>
            <select
                id="toggleChan"
                onChange={(e) => { setValue(e.target.value); props.toggleChan(e.target.value) }}
            >
                {chanJoined.map((arrayChan, index) => <option key={index}>{arrayChan}</option>)}
            </select>
            <div><button className="button" onClick={() => props.toggleChan(value)}>Select Channel</button></div>
            <div><button className="button" onClick={() => { props.leaveChan(value); setValue(chanJoined[0]) }}>Leave Channel</button></div>
        </div>
    )
}
