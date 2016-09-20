import React from 'react';
import ChannelUser from './ip_chat/ip_chat';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        App Level
        <ChannelUser device="browser"
          tokenUrl="api/token"
          channelSID="CH1d9bf2979c4a40709e18c47e839b18bf" />
      </div>
    );
  }
}

export default App;
