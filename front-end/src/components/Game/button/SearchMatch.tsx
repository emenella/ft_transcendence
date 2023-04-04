import React, { Component } from 'react';

type ButtonProps = {
  onClick: () => void;
  isSearching: boolean;
};

class SearchButton extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props);
  }

  handleClick = () => {
    this.setState({ isLoading: true });
    this.props.onClick();
  };

  render() {
    const { isSearching } = this.props;
    return (
      <button onClick={this.handleClick}>
        {isSearching ? 'En attente...' : 'PLAY'}
      </button>
    );
  }
}

export default SearchButton;