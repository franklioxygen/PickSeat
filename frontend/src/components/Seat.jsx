import React from "react";
import "../seat.css";
class Seat extends React.Component {
  constructor(props) {
    super(props);
    this.changeSeatState = this.changeSeatState.bind(this);
  }
  state = {
    id: this.props.id,
    seatState: this.props.seatState
    // 0 is not selected, 1 is selected by others, 2 is selected by userself
  };

  changeSeatState() {
    if (this.state.seatState !== 1) {
      this.props.pickSeat(this.state.id);
      this.setState({ seatState: this.state.seatState ? 0 : 2 });
    }
  }

  render() {
    return (
      <div
        onClick={this.changeSeatState}
        className={"seatState" + this.state.seatState}
        id={this.state.seatID}
      ></div>
    );
  }
}
export default Seat;
