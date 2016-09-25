import React from 'react';

class InviteMember extends React.Component {
  constructor(props) {
    super(props);
    this.inviteMember = props.inviteMember;

    this.state = {
      memberIdentity: ""
    };

    this._handleChange = this._handleChange.bind(this);
    this._inviteMember = this._inviteMember.bind(this);
  }

  _handleChange(key) {
    return (event) => {
      this.setState({[key]: event.target.value});
    };
  }

  _inviteMember(event) {
    event.preventDefault();
    let memberIdentity = this.state.memberIdentity;
    this.inviteMember(memberIdentity);
    this.setState({memberIdentity: ""});

  }

  render() {
    return (
      <div className="add-member-container">
        <form onSubmit={this._inviteMember}>
          <input className="add-member-input"
            placeholder="Invite Member"
            onChange={this._handleChange("memberIdentity")} />
          <button className="add-member-button">
            <div className="add-button-text">
              +
            </div>
          </button>
        </form>
      </div>
    );
  }
}

export default InviteMember;
