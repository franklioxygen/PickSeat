import React from "react";
class User extends React.Component {
  render() {
    return (
      <span>
        {this.props.username},{this.props.selectedSeats}
      </span>
    );
  }
}
export default User;
