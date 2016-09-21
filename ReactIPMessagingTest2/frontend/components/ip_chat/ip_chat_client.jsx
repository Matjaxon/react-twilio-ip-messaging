import React from 'react';
import ReactDOM from 'react-dom';
import ChannelUser from './ip_chat';

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

//expected props are token, url, device to refresh token.
class IPChatClient extends React.Component {
  constructor(props) {
    super(props);
    this.token = props.token;
    this.tokenUrl = props.tokenUrl;
    this.device = props.device || "browser"; // default to "browser"

    this.state = {};
  }

  componentWillMount() {
    let chatClient = this;
    $.ajax({
      method: "GET",
      url: chatClient.tokenUrl,
      data: {device: chatClient.device},
      success: (data) => {
        let accessManager = new Twilio.AccessManager(data.token);
        let messagingClient = new Twilio.IPMessaging.Client(accessManager);
        messagingClient.on('tokenExpired',
          () => refreshToken(accessManager,
            chatClient.tokenUrl,
            chatClient.device));
        chatClient.setState({
          accessManager,
          messagingClient
        });
      }
    });
  }

  render() {
    return (
      <div>
        Channel Manager goes here
        <ChannelUser
          device="browser"
          tokenUrl="api/token"
          channelSID="CH32aa9c46590e41a088a4e86f6c4d48d5"
        />
      </div>
    );
  }
}

export default IPChatClient;
