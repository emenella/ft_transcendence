import React, { useEffect , useState } from "react";
import { msg } from "./interfaceChat";
import "./Message.css"

export default function ToggleChanInput(props : {toggleChan: (value : string) => void, leaveChan: (chan : string) => void, chans : Map<string, msg[]>, activeChan: string}) {
    const [value, setValue] = useState(props.activeChan);

    const chanJoined : string[] = [];
    props.chans.forEach((c, k) => {
        chanJoined.push(k)
    });

    useEffect(() => {
        if (chanJoined.length > 0) {
            setValue(props.activeChan);
        }
    }, [props.activeChan !== ""])

    function resize() {
        const location = document.getElementById("toggleChan");
        if (location)
            location.style.width = '90%';
    }

    useEffect(() => {
        resize();
    })

    return (
        <>
            <select
                id="toggleChan"
                onChange={(e) => {setValue(e.target.value); props.toggleChan(e.target.value)} }
            >
            {chanJoined.map((arrayChan, index) => <option key={index}>{arrayChan}</option>)}
            </select>
            <div><button className="border border-teal-600 bg-teal-100 rounded" onClick={() => props.toggleChan(value)}>Select Channel</button></div>
            <div><button className="border border-teal-600 bg-teal-100 rounded" onClick={() => {props.leaveChan(value); setValue(chanJoined[0])}}>Leave Channel</button></div>
        </>
    )
}