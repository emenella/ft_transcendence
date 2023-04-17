import React from "react";
import "./Message.css"

function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
    const ref = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [dep]);
    return ref as React.MutableRefObject<HTMLDivElement>;
}

export default function Message({messages}:{messages: string[]}) {
    const ref = useChatScroll(messages);
    return (
        <div className="message" ref={ref}>
            {messages.map((message, index) => (
                <div key={index}>{message}</div>
            ))}
        </div>
    )
}