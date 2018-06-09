// @flow

import React, { Component } from 'react';
import type { Element } from 'react';
import moment from 'moment-timezone';

import { ptvHash } from '../../hash';
import DepartureSection from './styles';

import { ReactComponent as WifiIcon } from '../../images/WiFi.svg';
import { ReactComponent as WarningIcon } from '../../images/Warning.svg';
import { ReactComponent as MetroTrainIcon } from '../../images/TrainMetro.svg';
import { ReactComponent as TramIcon } from '../../images/TrainLightRail.svg';
import { ReactComponent as BusIcon } from '../../images/Bus.svg';
import { ReactComponent as VLineIcon } from '../../images/Train.svg';

const DEV_ID = process.env.REACT_APP_PTV_DEV_ID;
const API_KEY = process.env.REACT_APP_PTV_API_KEY;

if (typeof DEV_ID !== 'string') {
  throw TypeError('Environment var REACT_APP_PTV_DEV_ID not of correct type');
}

if (typeof API_KEY !== 'string') {
  throw TypeError('Environment var REACT_APP_PTV_API_KEY not of correct type');
}

const DOMAIN = 'http://timetableapi.ptv.vic.gov.au';
const API_VERSION = '/v3';

const ARGS = `?expand=stop&expand=direction&expand=disruption&devid=${DEV_ID}`;

const routeTypeMap = [
  <MetroTrainIcon />,
  <TramIcon />,
  <BusIcon />,
  <VLineIcon />,
];

type Props = {
  position: [number, number],
  stopId: number,
  routeTypeId: number,
  routeId: ?number,
}

type Departure = {|
  run_id: number,
  direction_id: number,
  scheduled_departure_utc: string,
  estimated_departure_utc: string | null,
|}

type Direction = {|
  direction_id: number,
  route_id: number,
  direction_name: string,
|}

type Disruption = {|
  disruption_id: number,
  routes: {
    route_id: number,
    direction: {
      direction_id: number,
    }
  }[]
|}

type Stop = {|
  stop_id: number,
  stop_name: string,
|}

type DeparturesResponse = {
  departures: Array<Departure>,
  directions: { [string]: Direction },
  disruptions: { [string]: Disruption },
  stops: { [string]: Stop },
}

type State = {
  departures: Departure[],
  directions: { [string]: Direction },
  disruptions: { [string]: Disruption },
  stops: { [string]: Stop },
  loading: boolean,
  now: Date,
}

class PTVDeparturesBoard extends Component<Props, State> {
  loaderIntervalId: number
  tickIntervalId: number
  state = {
    departures: [],
    directions: {},
    disruptions: {},
    stops: {},
    loading: true,
    now: new Date(),
  };

  componentDidMount() {
    this.fetchStopInfo();
    this.loaderIntervalId = window.setInterval(
      () => this.fetchStopInfo(),
      1000 * 60, // 60 seconds
    );

    this.tickIntervalId = window.setInterval(
      () => this.tick(),
      1000 * 5, // 5 seconds
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.loaderIntervalId);
    window.clearInterval(this.tickIntervalId);
  }

  tick() {
    this.setState({ now: new Date() });
  }

  generateStopUrl() {
    let url = `${API_VERSION}/departures/route_type/${this.props.routeTypeId}/stop/${this.props.stopId}`;
    if (this.props.routeId != null) {
      url += `/route/${this.props.routeId}`;
    }
    url += ARGS;
    const signature = ptvHash(url, API_KEY);
    return `${DOMAIN}${url}&signature=${signature}`;
  }

  async fetchStopInfo() {
    const url = this.generateStopUrl();
    const resp = await fetch(url);
    if (!resp.ok) {
      // TODO: handle errors better
      this.setState({ loading: false });
      throw Error('Could not fetch stop data');
    }

    const {
      departures, directions, disruptions, stops,
    }: DeparturesResponse = await resp.json();

    this.setState({
      departures, directions, disruptions, stops, loading: false,
    });
  }

  getNextDepartures() {
    const {
      departures,
      directions,
      now,
    } = this.state;
    // $FlowFixMe Object.values() is borked and doesn't allow strict types
    const directionsList : Array<Direction> = Object.values(directions);
    const nextDepartures = directionsList.map(
      (direction) => {
        const index = departures.findIndex(
          d => d.direction_id === direction.direction_id
          && new Date(d.estimated_departure_utc || d.scheduled_departure_utc) > now,
        );
        return [
          departures[index],
          departures.length === index + 1 ? null : departures[index + 1],
        ];
      },
    ).filter(Boolean);
    return nextDepartures;
  }

  getDirectionName(directionId: number) {
    const direction = this.state.directions[directionId.toString()];
    return direction ? direction.direction_name : 'Unknown';
  }

  getStopName() {
    const stop = this.state.stops[this.props.stopId.toString()];
    return stop ? stop.stop_name : 'Unknown';
  }

  getDepartureDuration({
    estimated_departure_utc: estimated,
    scheduled_departure_utc: scheduled,
  }: Departure): Element<any> {
    const departureTime = estimated || scheduled;
    const duration = moment(departureTime).diff(moment(this.state.now), 'minutes');
    return (
      <>
        <span className="duration-number">
          {duration === 0 ? 'NOW' : duration}
        </span> {duration !== 0 && 'm'}
      </>
    );
  }

  disruptionsInDirection(directionId: number) {
    const direction = this.state.directions[directionId.toString()];
    if (!direction) {
      return false;
    }
    return Object.values(this.state.disruptions).some(
      // $FlowFixMe
      (disruption: Disruption) => disruption.directions.some(
        disruptionDirection => disruptionDirection.direction_id === directionId,
      ),
    );
  }

  render() {
    return (
      <DepartureSection position={this.props.position}>
        {this.state.loading ? <header>Loading...</header> : (
          <>
            <header>
              {routeTypeMap[this.props.routeTypeId]}
              <h1>Departures from {this.getStopName()}</h1>
            </header>
            {this.getNextDepartures().map(departures => (
              <section className="direction" key={departures[0].run_id}>
                <h2>To {this.getDirectionName(departures[0].direction_id)}</h2>
                {departures.map((departure, i) => (
                  <div
                    className={`departing-duration${i === 0 ? ' next' : ''}`}
                    key={departure ? departure.scheduled_departure_utc : i}
                  >
                    {departure
                      ? (<>
                        {this.getDepartureDuration(departure)}
                        {departure.estimated_departure_utc &&
                          <WifiIcon className="live-indicator" />
                        }
                        {this.disruptionsInDirection(departure.direction_id) &&
                          <WarningIcon className="disruption-indicator" />
                        }
                      </>)
                      : '&ndash;'
                    }
                  </div>
                ))}
              </section>
            ))}
          </>
        )}
      </DepartureSection>
    );
  }
}

export default PTVDeparturesBoard;
