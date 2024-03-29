import React from "react";
import { useNavigate } from "react-router-dom";
import "./Message.css"
import { msg } from "../../utils/interfaceChat";

function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
    const ref = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dep]);
    return ref as React.MutableRefObject<HTMLDivElement>;
}

export default function Message({ messages }: { messages: msg[] }) {
    const ref = useChatScroll(messages);

    const navigate = useNavigate();

    function nav(id : number) {
        navigate("/home/profile/" + id);
    }

    return (
        <div className="message" ref={ref}>
            {messages.map((message, index) => (
                <div className="ligne" key={index}>
                    <div className="header">
                        {message.date}
                        &nbsp;
                        <button onClick={() => nav(message.authorId)} className='user_button'>
                            {message.author + ':'}
                        </button>
                        &nbsp;
                    </div>
                    <div className="content">&nbsp;{message.content}&nbsp;</div>
                </div>
            ))}
        </div>
    )
}