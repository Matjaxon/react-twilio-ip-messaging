import React from 'react';
import ChannelUser from './ip_chat/ip_chat';
import IPChatClient from './ip_chat/ip_chat_client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this._loginAsMatt = this._loginAsMatt.bind(this);
  }

  _loginAsMatt(event) {
    event.preventDefault();
    console.log("clicked");
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

  render() {
    if (!this.state.currentUser) {
      return (
        <div>
          <div>Log in to chat</div>
          <button onClick={this._loginAsMatt}>
            Login as Matt
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
