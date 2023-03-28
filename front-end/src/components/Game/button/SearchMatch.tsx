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
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 3000); // Temps d'attente de 3 secondes pour la démonstration
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