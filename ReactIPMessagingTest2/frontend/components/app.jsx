import React from 'react';
import ChannelUser from './ip_chat/ip_chat';
import IPChatClient from './ip_chat/ip_chat_client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this._loginAsMatt = this._loginAsMatt.bind(this);
    this._loginAsBilly = this._loginAsBilly.bind(this);
  }

  _loginAsMatt(event) {
    event.preventDefault();
    let app = this;
    $.ajax({
      method: "POST",
      url: "api/session",
      data: {
        user: {
          username: "matt",
          password: "password"
        }
      },
      success: (data) => app.setState({currentUser: data})
    });
  }

  _loginAsBilly(event) {
    event.preventDefault();
    let app = this;
    $.ajax({
      method: "POST",
      url: "api/session",
      data: {
        user: {
          username: "billy",
          password: "password"
        }
      },
      success: (data) => app.setState({currentUser: data})
    });
  }

  render() {
    if (!this.state.currentUser) {
      return (
        <div>
          <div>Log in to chat</div>
          <button onClick={this._loginAsMatt}>
            Login as Matt
          </button>
          <button onClick={this._loginAsBilly}>
            Login as Billy
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <IPChatClient
            device="browser"
            tokenUrl="api/token"
            />
        </div>
      );
    }
  }
}

export default App;
