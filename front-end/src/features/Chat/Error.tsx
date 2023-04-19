import React from "react";

export default function Error(props :{ isShown: boolean, error: string, close: (value: boolean) => void }) {
    if (props.isShown === false){
        return (<div></div>);
    }
    else {
        return (
            <div>
                {/* <span onClick={() => props.close(false)}>&times;</span> */}
                {/* <p>{props.error}</p> */}
                <button onClick={() => props.close(false)}>{props.error}<br></br>Click to close</button>
            </div>
        )
    }
}