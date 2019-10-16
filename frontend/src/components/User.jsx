import React from "react";
class User extends React.Component {
  render() {
    return (
      <span>
        User:
        {this.props.username} <br />
        {}
        Your available slots:
        {10 - this.props.userSeats.length}/10 <br />
        Selected seat number:
        <br />
        {this.props.userSeats.map(seat => (
          <span key={seat}>{seat} </span>
        ))}
        <br />
      </span>
    );
  }
}
export default User;
