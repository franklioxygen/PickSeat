import React from "react";
import "../seat.css";
class Seat extends React.Component {
  constructor(props) {
    super(props);
    this.changeSeatState = this.changeSeatState.bind(this);
  }

  changeSeatState() {
    if (this.props.seatState !== 1) {
      this.props.pickSeat(this.props.id);
      this.setState({ seatState: this.props.seatState ? 0 : 2 });
    }
  }

  render() {
    return (
      <div
        onClick={this.changeSeatState}
        className={"seatState" + this.props.seatState}
        id={this.props.seatID}
      ></div>
    );
  }
}
export default Seat;
