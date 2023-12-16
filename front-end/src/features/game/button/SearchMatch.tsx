import React, { Component } from 'react';
import "./MatchmakingButton.css";

type ButtonProps = {
	onClick: () => void;
};

class SearchButton extends Component<ButtonProps> {
	
	handleClick = () => {
		this.setState({ isLoading: true });
		this.props.onClick();
	};

	render() {
		return (
			<button className="button_game" onClick={this.handleClick}>Jouer</button>
		);
	}
}

export default SearchButton;
