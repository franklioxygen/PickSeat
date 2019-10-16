import React from "react";
class User extends React.Component {
  render() {
    return (
      <span>
        {this.props.username} Selected:
        {this.props.userSeats.map(seat => (
          <span key={seat}>{seat} </span>
        ))}
      </span>
    );
  }
}
export default User;
