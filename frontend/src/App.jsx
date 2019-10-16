import React from "react";
import Seat from "./components/Seat";
import User from "./components/User";
import UserList from "./components/UserList";
import "./App.css";
import socketIOClient from "socket.io-client";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.pickSeat = this.pickSeat.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      endpoint: window.location.hostname + ":3001",
      user: {},
      seats: [],
      userList: {}
    };
  }

  async pickSeat(seatID) {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("seat changed", seatID, this.state.user.id);
  }

  async changeUserSeatState(seatID, userID) {
    if (userID === this.state.user.id) {
      let userID = this.state.user.id;
      let username = this.state.user.username;
      let newSeats = this.state.user.userSeats;
      if (newSeats.includes(seatID))
        newSeats = newSeats.filter(e => e !== seatID);
      else newSeats.push(seatID);
      console.log(newSeats);

      await fetch(
        "http://" +
          window.location.hostname +
          ":8080/api/users/" +
          this.state.user.id,
        {
          method: "PUT",
          body: JSON.stringify({
            id: this.state.user.id,
            username: this.state.user.username,
            userSeats: newSeats
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }
      );
      this.setState({
        user: {
          id: userID,
          username: username,
          userSeats: newSeats
        }
      });
      console.log(this.state.user);
    }
  }

  async changeSeatsSet(seatID, userID) {
    let newSeats = this.state.seats;
    let occupyState = userID === this.state.user.id ? 2 : 1;
    let newState = 5;
    newSeats = this.state.seats.map(el => {
      if (el.id === seatID) {
        el.state = el.state ? 0 : occupyState;
        newState = el.state ? 1 : 0;
      }
      return el;
    });

    await fetch(
      "http://" + window.location.hostname + ":8080/api/seats/" + seatID,
      {
        method: "PUT",
        body: JSON.stringify({
          id: seatID,
          state: newState
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    );
    this.setState({ seats: newSeats });
  }

  async componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("seat changed", (seatID, userID) => {
      this.changeUserSeatState(seatID, userID);
      this.changeSeatsSet(seatID, userID);
    });

    await fetch(
      "http://" +
        window.location.hostname +
        ":8080/api/users/" +
        this.state.user.id
    )
      .then(json => json.json())
      .then(data => {
        this.setState({ user: data });
      });

    await fetch("http://" + window.location.hostname + ":8080/api/seats")
      .then(json => json.json())
      .then(data => {
        this.setState({ seats: data });
      });

    await fetch("http://" + window.location.hostname + ":8080/api/users")
      .then(json => json.json())
      .then(data => {
        this.setState({ userList: data });
      });
  }
  login(id, name, userSeats) {
    this.setState({
      user: {
        id: id,
        username: name,
        userSeats: userSeats
      }
    });
  }

  logout() {
    this.setState({
      user: {}
    });
  }

  render() {
    if (this.state.user.username === undefined) {
      return (
        <div className="App">
          <UserList list={this.state.userList} login={this.login}></UserList>
        </div>
      );
    } else {
      return (
        <div className="App">
          <p onClick={this.logout}>logout</p>
          <span>User:</span>
          <User
            id={this.state.user.id}
            username={this.state.user.username}
            userSeats={this.state.user.userSeats}
          ></User>
          <p></p>
          <span>Seats:</span>
          {this.state.seats.map(seat => (
            <Seat
              pickSeat={this.pickSeat}
              key={seat.id}
              seatState={
                this.state.user.userSeats.includes(seat.id) ? 2 : seat.state
              }
              id={seat.id}
            ></Seat>
          ))}
        </div>
      );
    }
  }
}
export default App;
