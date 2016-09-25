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
    this._addChannel = this._addChannel.bind(this);
    this._listenForInvites = this._listenForInvites.bind(this);
    this._subscribeChannel = this._subscribeChannel.bind(this);
  }

  componentWillMount() {
    this._listenForInvites();
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
      channel.join().then(joinedChannel => {
        channel = joinedChannel;
        channel.getMessages().then(channelMessages => {
          channelsProcessed ++;
          messages[channel.uniqueName] = channel.messages;
          unreadMessageCounts[channel.uniqueName] =
            (channel.lastConsumedMessageIndex) ?
            channelMessages.length - 1 - channel.lastConsumedMessageIndex : 0;
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
    });
  }

  _subscribeChannel(channel) {
    channel.on('messageAdded', () => {
      channel.getMessages().then(newMessages => {
        let allMessages = Object.assign({}, this.state.messages);
        allMessages[channel.uniqueName] = newMessages;
        let unreadMessageCounts = Object.assign({}, this.state.unreadMessageCounts);
        if (channel !== this.state.activeChannel) {
          unreadMessageCounts[channel.uniqueName] += 1;
        }
        this.setState({messages: allMessages, unreadMessageCounts});
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

  _addChannel(newChannel) {
    newChannel.join().then(joinedChannel => {
      this._subscribeChannel(joinedChannel);
      let channels = Object.assign({}, this.state.channels);
      let messages = Object.assign({}, this.state.messages);
      let unreadMessageCounts = Object.assign({}, this.state.unreadMessageCounts);
      channels[newChannel.uniqueName] = newChannel;
      messages[newChannel.uniqueName] = [];
      unreadMessageCounts[newChannel.uniqueName] = 0;
      this._subscribeChannel(joinedChannel);
      this.setState({channels, activeChannel: newChannel});
    });
  }

  _listenForInvites() {
    debugger;
    this.messagingClient.on("channelInvited", (channel) => {
      this._acceptInvite(channel);
    });
  }

  _acceptInvite(channel) {
    this._addChannel(channel);
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
          <div className="channel-names-container">
            {channelNames}
          </div>
          <AddChannel
            messagingClient={this.messagingClient}
            addChannel={this._addChannel}/>
        </div>
        {activeChat}
      </div>
    );
  }
}

export default IPChatChannelManager;
