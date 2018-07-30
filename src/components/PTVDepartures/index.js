// @flow

import React, { Component } from 'react';

import { ptvHash } from '../../hash';
import DirectionDepartures from './departure';
import DepartureSection from './styles';

// $FlowFixMe
import { ReactComponent as MetroTrainIcon } from '../../images/TrainMetro.svg';
// $FlowFixMe
import { ReactComponent as TramIcon } from '../../images/TrainLightRail.svg';
// $FlowFixMe
import { ReactComponent as BusIcon } from '../../images/Bus.svg';
// $FlowFixMe
import { ReactComponent as VLineIcon } from '../../images/Train.svg';

const DEV_ID = process.env.REACT_APP_PTV_DEV_ID;
const API_KEY = process.env.REACT_APP_PTV_API_KEY;

if (typeof DEV_ID !== 'string') {
  throw TypeError('Environment var REACT_APP_PTV_DEV_ID not of correct type');
}

if (typeof API_KEY !== 'string') {
  throw TypeError('Environment var REACT_APP_PTV_API_KEY not of correct type');
}

const DOMAIN = '//timetableapi.ptv.vic.gov.au';
const API_VERSION = '/v3';

const MAX_RESULTS = 5;
const ARGS = [
  `max_results=${MAX_RESULTS}`,
  'expand=stop',
  'expand=direction',
  'expand=disruption',
  'expand=route',
  `&devid=${DEV_ID}`,
];

const routeTypeMap = [
  <MetroTrainIcon className="train" />,
  <TramIcon className="tram" />,
  <BusIcon className="bus" />,
  <VLineIcon className="vline" />,
];

type Props = {
  position: [number, number],
  stopId: number,
  routeTypeId: number,
  routeId: ?number,
}

export type Departure = {|
  run_id: number,
  route_id: number,
  direction_id: number,
  scheduled_departure_utc: string,
  estimated_departure_utc: string | null,
|}

type Direction = {|
  direction_id: number,
  route_id: number,
  direction_name: string,
  name: string,
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

export type Route = {|
  route_id: number,
  route_name: string,
  route_number: string,
|}

type DeparturesResponse = {
  departures: Array<Departure>,
  directions: { [string]: Direction },
  disruptions: { [string]: Disruption },
  stops: { [string]: Stop },
  routes: { [string]: Route },
}

type State = {
  departures: Departure[],
  directions: { [string]: Direction },
  disruptions: { [string]: Disruption },
  stops: { [string]: Stop },
  routes: { [string]: Route },
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
    routes: {},
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
    url += `?${ARGS.join('&')}`;
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
      departures, directions, disruptions, stops, routes,
    }: DeparturesResponse = await resp.json();

    this.setState({
      departures, directions, disruptions, stops, routes, loading: false,
    });
  }

  getNextDepartures(): Array<[number, Array<Departure>]> {
    const {
      departures,
      directions,
      now,
    } = this.state;
    const nextDepartures = Object.keys(directions)
      .map(d => parseInt(d, 0))
      .map(directionId => ([
        directionId,
        departures.filter(d => (
          d.direction_id === directionId
          && new Date(d.estimated_departure_utc || d.scheduled_departure_utc) > now
        )),
      ]));

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

  disruptionsInDirection(directionId: number) {
    const direction = this.state.directions[directionId.toString()];

    if (!direction) {
      return false;
    }

    return Object.values(this.state.disruptions).some(
      // $FlowFixMe
      (disruption: Disruption) => disruption.routes.some(
        route => route.direction === null || route.direction === directionId,
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
            <section className="departures">
              {this.getNextDepartures().map(([directionId, departures]) => (
                <DirectionDepartures
                  key={directionId}
                  name={this.getDirectionName(directionId)}
                  departures={departures}
                  routes={this.state.routes}
                  now={this.state.now}
                  disruptions={this.disruptionsInDirection(directionId)}
                />
              ))}
            </section>
          </>
        )}
      </DepartureSection>
    );
  }
}

export default PTVDeparturesBoard;
