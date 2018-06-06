// @flow

import React, { Component } from 'react';
import Clock from 'react-clock';
import moment from 'moment-timezone';
import BoardSection from './BoardSection';

const ClockSection = BoardSection.extend`
  flex-direction: column;

  .clock-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 1.5em;
  }

  .react-clock__face {
    background: #f5f5f5;
    box-shadow: 0 0 0 2px white;
  }

  .clock-label {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.5em;
  }
`;

const TIME_FORMAT = 'HH:mm:ss';

type Props = {
  timezone: string,
  position: [number, number],
}

type State = {
  time: Date,
  clockSize: number,
}

class ClockBoard extends Component<Props, State> {
  intervalId: number
  wrapperRef: ?HTMLDivElement

  state = {
    time: this.getTime(),
    clockSize: 0,
  }

  constructor(props: Props) {
    super(props);
    (this: any).setClockSize = this.setClockSize.bind(this);
  }

  componentDidMount() {
    this.intervalId = window.setInterval(
      () => this.setState({ time: this.getTime() }),
      1000,
    );

    this.setClockSize();
    window.addEventListener('resize', this.setClockSize);
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
    window.removeEventListener('resize', this.setClockSize);
  }

  getTime() {
    return moment.tz(this.props.timezone).format(TIME_FORMAT);
  }

  setClockSize() {
    if (this.wrapperRef) {
      const { height, width } = window.getComputedStyle(this.wrapperRef);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ clockSize: Math.min(parseFloat(height), parseFloat(width)) });
    }
  }

  render() {
    return (
      <ClockSection position={this.props.position}>
        <div className="clock-wrapper" ref={(e) => { this.wrapperRef = e; }}>
          <Clock value={this.state.time} size={this.state.clockSize} />
        </div>
        <span className="clock-label">{this.props.timezone.split('/')[1]}</span>
      </ClockSection>
    );
  }
}

export default ClockBoard;

