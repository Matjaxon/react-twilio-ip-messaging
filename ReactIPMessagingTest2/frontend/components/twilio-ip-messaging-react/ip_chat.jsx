import React from 'react';
import IPMessage from './ip_message';
import InviteMember from './invite_member';
import IPChatChannelController from './ip_chat_channel_controller';

require('./ip_messaging_stylesheet.css');

class ChatChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.messages
    };
    this.channel = props.channel;
    this.channelName = props.channel.friendlyName;
    this.leaveChannel = props.leaveChannel;

    this.channelEventCallbacks = {
      memberJoined: props.onMemberJoined,
      memberLeft: props.onMemberLeft,
      memberUpdated: props.onMemberUpdated,
      memberInfoUpdated: props.onMemberInfoUpdated,
      messageAdded: props.onMessageAdded,
      messageRemoved: props.onMessageRemoved,
      messageUpdated: props.onMessageUpdated,
      typingEnded: props.onTypingEnded,
      typingStarted: props.onTypingStarted,
      updated: props.onUpdated
    };

    //Bind methods to instance
    this._sendMessage = this._sendMessage.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._scrollToBottom = this._scrollToBottom.bind(this);
    this._fetchMessages = this._fetchMessages.bind(this);
    this._inviteMember = this._inviteMember.bind(this);
    this._leaveChannel = this._leaveChannel.bind(this);
    this._setupEventListenersFromProps = this._setupEventListenersFromProps.bind(this);

    /*
      Add custom callbacks passed in as props as event listeners
      for events delivered by the Twilio API.
    */
    this._setupEventListenersFromProps(this.channel,
      this, this.channelEventCallbacks);
  }

  componentWillMount() {
    let channel = this.channel;
    let chatChannel = this;

    channel.join().then( (session) => {
      channel.getMessages().then(messages => {
        chatChannel.setState({
          messages
        });
      });
    });

    channel.on('messageAdded', this._fetchMessages);
  }

  componentWillUnmount() {
    this.channel.removeListener("messageAdded", this._fetchMessages);
  }

  componentDidUpdate() {
    this._scrollToBottom();
  }

  _fetchMessages() {
    let channel = this.channel;
    let chatChannel = this;
    channel.getMessages().then(newMessages => {
      chatChannel.setState({messages: newMessages});
    });
  }

  _setupEventListenersFromProps(channel, chatChannel, channelEventCallbacks) {
    let channelEvents = Object.keys(channelEventCallbacks);
    channelEvents.forEach( channelEvent => {
      if (channelEventCallbacks[channelEvent]) {
        let callback = channelEventCallbacks[channelEvent];
        channel.on(channelEvent, (defaultReturn) => {
          callback(event.params, chatChannel.state);
        });
      }
    });
  }

  _handleChange(key) {
    return (event) => {
      this.channel.typing();
      this.setState({[key]: event.target.value});
    };
  }

  _sendMessage(event) {
    event.preventDefault();
    if (this.state.currentMessage.length > 0) {
      this.channel.sendMessage(this.state.currentMessage);
      this.setState({currentMessage: ""});
    }
  }

  _scrollToBottom() {
    let chatWindows = Array.from(
        document.getElementsByClassName("channel-user-chat-window")
      );
    chatWindows.forEach(chatWindow => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }

  _inviteMember(identity) {
    this.channel.invite(identity);
  }

  _leaveChannel() {
    this.channel.leave();
    this.leaveChannel(this.channel);
  }

  render() {
    let messages = this.state.messages;
    let chatMessages;
    if(messages) {
      chatMessages = messages.map(message => {
        return <IPMessage
          author={message.author}
          body={message.body}
          timestamp={message.timestamp}
          key={message.sid}
        />;
      });
    } else {
      chatMessages = <div>Loading...</div>;
    }

    return (
      <div className="channel-user-chat-container">
        <div className="channel-user-channel-name-container">
          <div className="channel-user-channel-name">
            {this.channelName}
          </div>
          <InviteMember inviteMember={this._inviteMember}/>
        </div>
        <IPChatChannelController leaveChannel={this._leaveChannel}/>
        <div className="channel-user-chat-window">
          {chatMessages}
        </div>
        <div className="channel-user-input-container">
          <textarea className="channel-user-chat-input"
            onChange={this._handleChange('currentMessage')}
            value={this.state.currentMessage || ""}>
          </textarea>
          <div className="channel-user-chat-send-button"
            onClick={this._sendMessage}>Send</div>
        </div>
      </div>
    );
  }
}
 export default ChatChannel;
