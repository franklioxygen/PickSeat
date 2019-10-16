import React from "react";
import "../seat.css";
class Seat extends React.Component {
  constructor(props) {
    super(props);
    this.changeSeatState = this.changeSeatState.bind(this);
  }

  changeSeatState() {
    if (this.props.seatState !== 1) {
      if (this.props.seatState === 0 && this.props.currentUserSeatAmount > 9) {
        alert(
          "You reached 10 slots limit, please deselect before select new seat."
        );
      } else {
        this.props.pickSeat(this.props.id);
        this.setState({ seatState: this.props.seatState ? 0 : 2 });
      }
    }
  }

  render() {
    let newLine = "";
    if ((this.props.index + 1) % 10 === 0) newLine = <br />;
    return (
      <span>
        <div
          onClick={this.changeSeatState}
          className={"seatState" + this.props.seatState}
          id={this.props.seatID}
        ></div>
        {newLine}
      </span>
    );
  }
}
export default Seat;
