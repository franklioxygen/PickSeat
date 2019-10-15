import React from "react";
import Seat from "./components/Seat";
import User from "./components/User";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.pickSeat = this.pickSeat.bind(this);
  }

  state = {
    user: {},
    seats: []
  };

  pickSeat(seatID) {
    let userID = this.state.user.id;
    let username = this.state.user.username;
    let newSeats = this.state.user.seats;
    if (newSeats.includes(seatID))
      newSeats = newSeats.filter(e => e !== seatID);
    else newSeats.push(seatID);
    console.log(newSeats);
    this.setState({
      user: {
        id: userID,
        username: username,
        seats: newSeats
      }
    });
  }

  async componentDidMount() {
    await fetch("http://" + window.location.hostname + ":8080/api/users/1")
      .then(json => json.json())
      .then(data => {
        this.setState({ user: data });
      });

    await fetch("http://" + window.location.hostname + ":8080/api/seats")
      .then(json => json.json())
      .then(data => {
        this.setState({ seats: data });
      });
  }

  render() {
    return (
      <div className="App">
        <span>User:</span>
        <User
          username={this.state.user.username}
          selectedSeats={this.state.user.seats}
        ></User>
        <p></p>
        <span>Seats:</span>
        {this.state.seats.map(seat => (
          <Seat
            pickSeat={this.pickSeat}
            key={seat.id}
            seatState={this.state.user.seats.includes(seat.id) ? 2 : seat.state}
            id={seat.id}
          ></Seat>
        ))}
      </div>
    );
  }
}
export default App;
