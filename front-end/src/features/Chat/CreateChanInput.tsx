import React, { useState, useEffect } from "react";
import "./Message.css"

export default function CreateChanInput({createChan}:{createChan:(title: string, isPrivate: boolean, password: string | undefined) => void}) {
    const [value, setValue] = useState("");
    const [password, setPass] = useState("");
    const [invitOnly, setInviteOnly] = useState(false);

    function resize(id: string, size: string) {
        const location = document.getElementById(id);
        if (location)
            location.style.width = size;
    }

    useEffect(() => {
        resize("titleCreate", "90%");
        resize("passCreate", "90%");
    })

    return (
        <>
            <input
                className="nowrap"
                id="titleCreate"
                onChange={(e) => setValue(e.target.value)}
                placeholder="title"
                value={value}
                maxLength={4096}
            />
            <input
                type="password"
                id="passCreate"
                onChange={(e) => setPass(e.target.value)}
                placeholder="password (optional)"
                value={password}
                maxLength={4096}
            />
            <div>
            <label>Private
            <input
                type="checkbox"
                checked={invitOnly}
                onChange={(e) => setInviteOnly(e.target.checked)}
                maxLength={4096}
                />
            </label>
            </div>
            <button className="button" onClick={() => createChan(value, invitOnly, password)}>Create Channel</button>
        </>
    )
}