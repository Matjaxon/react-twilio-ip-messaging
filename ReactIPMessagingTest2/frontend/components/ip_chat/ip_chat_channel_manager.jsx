import React from 'react';
import ChannelUser from './ip_chat';
import AddChannel from './add_channel';

function announceMessage() {
  console.log("MESSAGE CALLBACK!");
}

function announceTyping() {
  console.log("WHOA SOMEONES TYPING!");
}

class IPChatChannelManager extends React.Component {
  constructor(props) {
    super(props);
    this.messagingClient = props.messagingClient;
    this.state = {
      channels: null,
      messages: null,
      activeChannel: null,
      unreadMessageCounts: null
    };

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
    let unreadMessageCounts = {};
    let channelsProcessed = 0;
    channels.forEach(channel => {
      channel.on('messageAdded', () => {
        channel.getMessages().then(newMessages => {
          let allMessages = Object.assign({}, channelManager.state.messages);
          allMessages[channel.uniqueName] = newMessages;
          unreadMessageCounts = Object.assign({}, channelManager.state.unreadMessageCounts);
          if (channel !== channelManager.state.activeChannel) {
            unreadMessageCounts[channel.uniqueName] += 1;
          }
          channelManager.setState({messages: allMessages, unreadMessageCounts});
        });
      });
      channel.getMessages().then(channelMessages => {
        channelsProcessed ++;
        messages[channel.uniqueName] = channel.messages;
        unreadMessageCounts[channel.uniqueName] =
          channelMessages.length - 1 - channel.lastConsumedMessageIndex;
        if (channelsProcessed === channels.length) {
          let activeChannel = channels[0];
          activeChannel.setAllMessagesConsumed();
          unreadMessageCounts[activeChannel.uniqueName] = 0;
          channelManager.setState({
            messages,
            activeChannel: channels[0],
            unreadMessageCounts
          });
        }
      });
    });
  }

  _changeChannel(uniqueName) {
    let channel = this.state.channels[uniqueName];
    channel.setAllMessagesConsumed();
    let unreadMessageCounts = Object.assign({}, this.state.unreadMessageCounts);
    unreadMessageCounts[channel.uniqueName] = 0;
    this.setState({activeChannel: channel, unreadMessageCounts});
  }

  render() {
    let channelManager = this;
    let channels = this.state.channels;
    let messages = this.state.messages;
    let activeChannel = this.state.activeChannel;
    let unreadMessageCounts = this.state.unreadMessageCounts;

    let channelNames;
    if (channels) {
      let channelKeys = Object.keys(channels);
      channelNames = channelKeys.map(channelKey => {
        let channel = channels[channelKey];
        let activeStatus = (activeChannel === channel) ?
          " active-channel-name" : "";
        let messageCount = (unreadMessageCounts &&
          unreadMessageCounts[channelKey]) ?
          unreadMessageCounts[channelKey] : "";
        return (
          <div
            className={`channel-manager-channel-name` + activeStatus}
            key={channel.sid}
            onClick={() => channelManager._changeChannel(channel.uniqueName)}>
            <div className={`channel-name-unread-messages-container
              ${(messageCount === "") ? "" : 'channel-name-unread-messages'}`}>
              {messageCount}
            </div>
            <div className="channel-name-text">{channel.friendlyName}</div>
          </div>
        );
      });
    } else {
      channelNames = <div>Loading...</div>;
    }

    let activeChat;
    if (activeChannel && messages) {
      activeChat = (
        <ChannelUser
          key={activeChannel.sid}
          channel={activeChannel}
          messages={messages[activeChannel.uniqueName]}
          onMessageAdded={announceMessage}
          onTypingStarted={announceTyping}
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
          <AddChannel />
        </div>
        {activeChat}
      </div>
    );
  }
}

export default IPChatChannelManager;
