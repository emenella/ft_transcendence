import React, { useState } from "react";

export default function ToggleChanInput(props : {toggleChan: (value : string) => void, leaveChan: (chan : string) => void, chans : Map<string, string[]>}) {
    const [value, setValue] = useState("");

    const chanJoined : string[] = [];
    props.chans.forEach((c, k) => {
        chanJoined.push(k)
    });

    if (chanJoined.length > 0) {
        setValue(chanJoined[0]);
    }

    return (
        <>
            <select onChange={(e) =>setValue(e.target.value)}>
            {chanJoined.map(arrayChan => <option value={arrayChan}>{arrayChan}</option>)}
            </select>
            <button onClick={() => props.toggleChan(value)}>Select Channel</button>
            <button onClick={() => props.leaveChan(value)}>Leave Channel</button>
        </>
    )
}