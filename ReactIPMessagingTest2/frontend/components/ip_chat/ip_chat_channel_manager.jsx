import React from 'react';
import ChannelUser from './ip_chat';

class IPChatChannelManager extends React.Component {
  constructor(props) {
    super(props);
    this.messagingClient = props.messagingClient;
    this.state = {};

    this._loadChannelList = this._loadChannelList.bind(this);
  }

  componentWillMount() {
    this._loadChannelList();
  }

  _loadChannelList() {
    let messagingClient = this.messagingClient;
    messagingClient.getChannels().then(channels => {
      this.setState({channels});
    });
  }

  render() {
    let channelNames;
    if (this.state.channels) {
      channelNames = this.state.channels.map(channel => {
        return (
          <div
            className="channel-manager-channel-name"
            key={channel.sid}>
            <span className="channel-name-text">{channel.friendlyName}</span>
          </div>
        );
      });
    } else {
      channelNames = <div>Loading...</div>;
    }

    let chatChannels;
    if (this.state.channels) {
      chatChannels = this.state.channels.map(channel => {
        return <ChannelUser key={channel.sid} channel={channel} />;
      });
    } else {
      chatChannels = <div>Loading...</div>;
    }

    return (
      <div className="active-chat-container">
        <div className="active-channel-manager">
          {channelNames}
        </div>
        {chatChannels}
      </div>
    );
  }
}

export default IPChatChannelManager;
