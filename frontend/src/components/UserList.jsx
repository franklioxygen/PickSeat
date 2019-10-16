import React from "react";
class UserList extends React.Component {
  render() {
    return (
      <span>
        <p>Select your name:</p>
        {Object.keys(this.props.list).map((keyname, i) => (
          <li
            key={i}
            onClick={() => {
              this.props.login(
                this.props.list[keyname].id,
                this.props.list[keyname].username,
                this.props.list[keyname].userSeats
              );
            }}
          >
            {this.props.list[keyname].username}
          </li>
        ))}
      </span>
    );
  }
}
export default UserList;
