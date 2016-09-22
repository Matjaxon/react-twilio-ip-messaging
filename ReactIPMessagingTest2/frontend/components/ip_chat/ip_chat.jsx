import React from 'react';
import IPMessage from './ip_message';

class ChannelUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.props.messages
    };
    this.channel = props.channel;
    this.channelName = props.channel.friendlyName;

    this._sendMessage = this._sendMessage.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._scrollToBottom = this._scrollToBottom.bind(this);
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

    channel.on('messageAdded', () => {
      channel.getMessages().then(newMessages => {
        chatChannel.setState({messages: newMessages});
      });
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
      this.channel.sendMessage(this.state.currentMessage);
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
        </div>
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
