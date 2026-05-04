import { Component } from 'react';

interface ErrorButtonState {
  shouldThrowError: boolean;
}

class ErrorButton extends Component<Record<string, never>, ErrorButtonState> {
  state: ErrorButtonState = {
    shouldThrowError: false,
  };

  handleClick = (): void => {
    this.setState({
      shouldThrowError: true,
    });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Test application error');
    }

    return (
      <button
        className="mt-6 rounded-lg bg-red-600 px-5 py-2 font-medium text-white hover:bg-red-700"
        type="button"
        onClick={this.handleClick}
      >
        Test Error Boundary
      </button>
    );
  }
}

export default ErrorButton;
