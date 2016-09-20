import React from 'react';

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
  }

  componentWillMount() {
    $.ajax({
      method: "GET",
      url: this.tokenUrl,
      data: {device: this.device},
      success: (data) => {
        let accessManager = new Twilio.AccessManager(data.token);
        let messagingClient = new Twilio.IPMessaging.Client(accessManager);
        messagingClient.on('tokenExpired',
          () => refreshToken(accessManager, this.tokenUrl, this.device));
        this.setState({
          identity: data.identity,
          token: data.token,
          accessManager,
          messagingClient
        }, () => console.log(this.state));
      }
    });
  }

  render() {
    if (this.state.messagingClient) {
      this.state.messagingClient.getChannels().then((channels) => {
        let channel = channels[0];
        channel.join();
        console.log(channel);
        console.log(`Joined ${channel.friendlyName}`);
        // debugger;
      });
      // debugger;
      // console.log(channels);
    }
    return (
      <div className="channel-user-chat-container">
        <div className="channel-user-chat-window">
          {(this.state.token) ? this.state.token : '...loading'}
        </div>
        <div className="channel-user-input-container">
          <textarea className="channel-user-chat-input"></textarea>
          <div className="channel-user-chat-send-button">Send</div>
        </div>
      </div>
    );
  }
}



 export default ChannelUser;
