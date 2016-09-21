import React from 'react';
import IPMessage from './ip_message';

// HUGE issue with getting token refreshed, at least while at a/A
function refreshToken(accessManager, url, device) {
  $.ajax({
    method: "GET",
    url,
    data: {device: device},
    success: (data) => {
      accessManager.updateToken(data.token);
    }
  });
}

class ChannelUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.device = props.device;
    this.tokenUrl = props.tokenUrl;
    this.channelSID = props.channelSID;

    this._sendMessage = this._sendMessage.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._scrollToBottom = this._scrollToBottom.bind(this);
  }

  componentWillMount() {
    let chat = this;
    $.ajax({
      method: "GET",
      url: chat.tokenUrl,
      data: {device: chat.device},
      success: (data) => {
        let accessManager = new Twilio.AccessManager(data.token);
        let messagingClient = new Twilio.IPMessaging.Client(accessManager);
        messagingClient.on('tokenExpired',
          () => refreshToken(accessManager, chat.tokenUrl, chat.device));
        messagingClient.getChannelBySid(chat.channelSID).then(channel => {
          channel.join().then( (session) => {
            channel.getMessages().then(messages => {
              channel.on('messageAdded', () => {
                channel.getMessages().then(newMessages => {
                  chat.setState({messages: newMessages}, () => console.log(chat.state));
                });
              });
              chat.setState({
                identity: data.identity,
                token: data.token,
                accessManager,
                messagingClient,
                channel,
                messages
              }, () => console.log(chat.state));
            });
          });
        });
      }
    });
  }

  componentDidUpdate() {
    this._scrollToBottom();
  }

  _handleChange(key) {
    return (event) => this.setState({[key]: event.target.value});
  }

  _sendMessage(event) {
    event.preventDefault();
    if (this.state.currentMessage.length > 0) {
      this.state.channel.sendMessage(this.state.currentMessage);
      this.setState({currentMessage: ""});
    }
  }

  _scrollToBottom() {
    let chatWindows = Array.from(document.getElementsByClassName("channel-user-chat-window"));
    chatWindows.forEach(chatWindow => {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }

  render() {
    let channelName;
    if(this.state.channel) {
      channelName = (
        <div className="channel-user-channel-name">
          {this.state.channel.friendlyName}
        </div>
      );
    } else {
      channelName = (
        <div className="channel-user-channel-name">
          {`Name loading...`}
        </div>
      );
    }

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
      chatMessages = (
        <div className="channel-user-chat-window">
          {'Messages loading...'}
        </div>
      );
    }
    return (
      <div className="channel-user-chat-container">
        <div className="channel-user-channel-name-container">{channelName}</div>
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



 export default ChannelUser;
