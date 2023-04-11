import React, { Component } from 'react';

type ButtonProps = {
    onClick: () => void;
};


class LeaveButton extends Component<ButtonProps> {
    constructor(props: ButtonProps) {
        super(props);
    }
    
    render() {
        return ( <button onClick={this.props.onClick}> X </button> );
    }
}
    
    export default LeaveButton;