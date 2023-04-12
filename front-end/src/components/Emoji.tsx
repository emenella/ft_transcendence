import React from 'react';

interface emojiProps {
    label: string;
    symbol: any;
}

function Emoji(props: emojiProps) {
    return (
        <span
            className="emoji"
            role="img"
            aria-label={props.label ? props.label : ""}
            aria-hidden={props.label ? "false" : "true"}
        >
            {props.symbol}
        </span>
    );
};

export default Emoji;
