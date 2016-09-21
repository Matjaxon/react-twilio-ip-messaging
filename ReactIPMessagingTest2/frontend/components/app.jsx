import React from 'react';
import ChannelUser from './ip_chat/ip_chat';
import IPChatClient from './ip_chat/ip_chat_client';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>

        <IPChatClient
          device="browser"
          tokenUrl="api/token"
          channelSID="CH32aa9c46590e41a088a4e86f6c4d48d5"
          />
      </div>
    );
  }
}

export default App;