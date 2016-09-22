import React from 'react';
import ChannelUser from './ip_chat';

class IPChatChannelManager extends React.Component {
  constructor(props) {
    super(props);
    this.messagingClient = props.messagingClient;
    this.state = {};

    this._loadChannelList = this._loadChannelList.bind(this);
    this._fetchMessages = this._fetchMessages.bind(this);
    this._changeChannel = this._changeChannel.bind(this);
  }

  componentWillMount() {
    this._loadChannelList();
  }

  _loadChannelList() {
    let messagingClient = this.messagingClient;
    messagingClient.getChannels().then(channels => {
      let channelsHash = {};
      channels.forEach(channel => {
        channelsHash[channel.uniqueName] = channel;
      });
      this.setState({channels: channelsHash});
      this._fetchMessages(channels);
    });
  }

  _fetchMessages(channels) {
    let channelManager = this;
    let messages = {};
    channels.forEach(channel => {
      channel.on('messageAdded', () => {
        channel.getMessages().then(newMessages => {
          let allMessages = Object.assign({}, channelManager.state.messages);
          allMessages[channel.uniqueName] = newMessages;
          channelManager.setState({messages: allMessages});
        });
      });
      channel.getMessages().then(channelMessages => {
        messages[channel.uniqueName] = channelMessages;
      });
    });
    this.setState({messages, activeChannel: channels[0]});
  }

  _changeChannel(uniqueName) {
    let channel = this.state.channels[uniqueName];
    this.setState({activeChannel: channel});
  }

  render() {
    let channelNames;
    if (this.state.channels) {
      let channelKeys = Object.keys(this.state.channels);
      channelNames = channelKeys.map(channelKey => {
        let channel = this.state.channels[channelKey];
        let activeStatus = (this.state.activeChannel === channel) ?
          " active-channel-name" : "";
        return (
          <div
            className={`channel-manager-channel-name` + activeStatus}
            key={channel.sid}
            onClick={() => this._changeChannel(channel.uniqueName)}>
            <span className="channel-name-text">{channel.friendlyName}</span>
          </div>
        );
      });
    } else {
      channelNames = <div>Loading...</div>;
    }

    let activeChat;
    if (this.state.activeChannel) {
      let activeChannel = this.state.activeChannel;
      activeChat = (
        <ChannelUser
          key={activeChannel.sid}
          channel={activeChannel}
          messages={this.state.messages[activeChannel.uniqueName]}
        />
      );
    } else {
      activeChat = (
        <div>Loading...</div>
        );
    }

    return (
      <div className="active-chat-container">
        <div className="active-channel-manager">
          {channelNames}
        </div>
        {activeChat}
      </div>
    );
  }
}

export default IPChatChannelManager;
