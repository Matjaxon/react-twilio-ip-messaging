import React from 'react';

class IPChatChannelController extends React.Component {
  constructor(props) {
    super(props);
    this.leaveChannel = props.leaveChannel;
  }

  render() {
    return(
      <div className="chat-channel-controller">
        <button className="chat-channel-leave-button"
          onClick={this.leaveChannel}>
          Leave
        </button>
      </div>
    );
  }
}

export default IPChatChannelController;
