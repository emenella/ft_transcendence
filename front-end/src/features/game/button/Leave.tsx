import React, { Component } from 'react';
import "./MatchmakingButton.css";

type ButtonProps = {
    onClick: () => void;
};

class LeaveButton extends Component<ButtonProps> {

    render() {
        return (
            <div>
                <p>En attente d'un match...</p>
                <button onClick={this.props.onClick} className="button_game">Quitter</button>
            </div>
        );
    }
}

export default LeaveButton;
