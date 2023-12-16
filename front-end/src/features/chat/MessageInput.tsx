import React, { useEffect, useState } from "react";

export default function MessageInput(props: { send: (value: string) => void, activeChan: string }) {
    const [value, setValue] = useState("");

    function handleKeyPressed(e: any) {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

    function handleSend() {
        if (value !== "")
            props.send(value);
        setValue("");
    }

    function resize() {
        const location = document.getElementById("messageInput");
        if (location)
            location.style.width = '90%';
    }

    useEffect(() => {
        resize();
    })

    return (
        <div>
            <input
                id="messageInput"
                onChange={(e) => setValue(e.target.value)}
                placeholder={"Send a message in " + props.activeChan + " (/help to get the list of commands, no commands available in DM)"}
                value={value}
                onKeyDown={handleKeyPressed}
                width='120px'
                maxLength={4096}
            />
            <button className="button" onClick={handleSend}>Send</button>
        </div>
    )
}