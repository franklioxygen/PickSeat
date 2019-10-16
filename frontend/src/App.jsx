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
      userList: {},
      onlineUserNumber: 0
    };
  }
  //-------------send seat id and user id to backend----------------------
  pickSeat(seatID) {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("seat changed", seatID, this.state.user.id);
  }
  //----------------------
  // 1.change front end user seat list,
  // 2. send new user seat list to backend,
  // 3. update database
  //-----------------------
  async changeUserSeatState(seatID, userID) {
    if (userID === this.state.user.id) {
      let userID = this.state.user.id;
      let username = this.state.user.username;
      let newSeats = this.state.user.userSeats;
      if (newSeats.includes(seatID))
        newSeats = newSeats.filter(e => e !== seatID);
      else newSeats.push(seatID);
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
    }
  }
  //--------------------------
  // 1.change front end overall seat list,
  // 2. send new overall seat list to backend,
  // 3. update database
  //--------------------------
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
  //------------fetch data when component did mount-----------------------
  async componentDidMount() {
    // update user seat list and overall seat list when receive socket event
    const socket = socketIOClient(this.state.endpoint);
    /*
    socket.on("online users", onlineUserNum => {
      this.setState({ onlineUserNumber: onlineUserNum });
    });
    */
    socket.on("seat changed", (seatID, userID) => {
      this.changeUserSeatState(seatID, userID);
      this.changeSeatsSet(seatID, userID);
    });
    // fetch current user data
    if (this.state.user.username !== undefined) {
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
    }
    // fetch overall seat list
    await fetch("http://" + window.location.hostname + ":8080/api/seats")
      .then(json => json.json())
      .then(data => {
        this.setState({ seats: data });
      });
    // fetch user list for login
    await fetch("http://" + window.location.hostname + ":8080/api/users")
      .then(json => json.json())
      .then(data => {
        this.setState({ userList: data });
      });
  }
  //-------------log in and out----------------------
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
  //--------------render dom---------------------
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
          <User
            id={this.state.user.id}
            username={this.state.user.username}
            userSeats={this.state.user.userSeats}
            onlineUserNumber={this.state.onlineUserNumber}
          ></User>
          <br /> <br />
          <span>Seats:</span>
          <br />
          {this.state.seats.map((seat, index) => (
            <Seat
              pickSeat={this.pickSeat}
              key={seat.id}
              index={index}
              currentUserSeatAmount={this.state.user.userSeats.length}
              seatState={
                this.state.user.userSeats.includes(seat.id) ? 2 : seat.state
              }
              id={seat.id}
            ></Seat>
          ))}
          <p onClick={this.logout}>logout</p>
        </div>
      );
    }
  }
}
export default App;
