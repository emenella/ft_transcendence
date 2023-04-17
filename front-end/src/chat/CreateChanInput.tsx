import React, { useState } from "react";

export default function CreateChanInput({createChan}:{createChan:(title: string, isPrivate: boolean, password: string | undefined) => void}) {
    const [value, setValue] = useState("");
    const [password, setPass] = useState("");
    const [invitOnly, setInviteOnly] = useState(false);

    return (
        <>
            <input
                onChange={(e) => setValue(e.target.value)}
                placeholder="title"
                value={value}
            />
            <label>Private</label>
            <input
                checked={invitOnly}
                onChange={(e) => setInviteOnly(e.target.checked)}
            />
            <input
                onChange={(e) => setPass(e.target.value)}
                placeholder="password"
                value={password}
            />
            <button onClick={() => createChan(value, invitOnly, password)}>Create Channel</button>
        </>
    )
}