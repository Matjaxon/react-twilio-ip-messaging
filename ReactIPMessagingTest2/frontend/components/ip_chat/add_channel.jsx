import React from 'react';

class AddChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelName: ""
    };

    this.addChannel = props.addChannel;
    this.messagingClient = props.messagingClient;
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleCbange = this._handleChange.bind(this);
  }

  _handleChange(key) {
    return (event) => {
      this.setState({[key]: event.target.value});
    };
  }

  _handleSubmit(event) {
    event.preventDefault();
    let channelOptions = {
      friendlyName:this.state.channelName,
      isPrivate: true};
    let messagingClient = this.messagingClient;
    if (this.state.channelName.length > 0) {
      let uniqueName = channelOptions.friendlyName;
      while (uniqueName.indexOf(" ") > -1) {
        let idx = uniqueName.indexOf(" ");
        uniqueName = uniqueName.substr(0, idx) + "-" + uniqueName.substr(idx + 1);
      }
      let addString = "-";
      for (let i = 0; i < 10; i++) {
        let digit = Math.random() * 10;
        addString = addString + digit;
      }
      channelOptions.uniqueName = uniqueName + addString;
      this.setState({channelName: ""});
      messagingClient.createChannel(channelOptions).then(newChannel => {
        this.addChannel(newChannel);
      });
    }
  }

  render() {
    return(
      <div className="add-channel-container">
        <form onSubmit={this._handleSubmit}>
          <input type="text"
            className="add-channel-input"
            placeholder="New Channel"
            onChange={this._handleChange("channelName")}
           />
         <button
           className="add-channel-button"
           onClick={this._handleSubmit}>
           <div className="add-button-text">
             +
           </div>
         </button>
       </form>
      </div>
    );
  }
}

export default AddChannel;
