// @flow

import React from 'react';
import type { Element } from 'react';
import moment from 'moment-timezone';

// $FlowFixMe
import { ReactComponent as ClockIcon } from '../../images/Clock.svg';
// $FlowFixMe
import { ReactComponent as WarningIcon } from '../../images/Warning.svg';

import type { Departure, Route } from '.';

type Props = {
  departures: Array<Departure>,
  routes: { [string]: Route },
  now: Date,
  name: string,
  disruptions: boolean,
}

function getDepartureDuration(
  {
    estimated_departure_utc: estimated,
    scheduled_departure_utc: scheduled,
  }: Departure,
  now: Date,
): Element<any> {
  const departureTime = estimated || scheduled;
  const duration = moment.duration(moment(departureTime).diff(moment(now)));
  return (
      <>
        {duration.asHours() >= 1 && (
          <>
            <span className="duration-number">
              {Math.round(duration.asHours())}
            </span> h&nbsp;
          </>
        )}
        <span className="duration-number">
          {duration.minutes()}
        </span> m
      </>
  );
}

function getRoute(
  departure: Departure,
  departures: Array<Departure>,
  routes: { [string]: Route },
) {
  if (departures.some(d => d.route_id !== departure.route_id)) {
    const route = routes[departure.route_id.toString()];
    return route && <sup className="route-number">{route.route_number}</sup>;
  }
  return null;
}

const DirectionDepartures = ({
  departures,
  now,
  name,
  disruptions,
  routes,
}: Props) => (
  <section className="direction">
    <h2>To {name}</h2>
    {departures.slice(0, 2).map((departure, i) => (
      <div
        className={`departing-duration${i === 0 ? ' next' : ''}`}
        key={departure ? departure.scheduled_departure_utc : i}
      >
        {getDepartureDuration(departure, now)}
        {getRoute(departure, departures, routes)}
        {!departure.estimated_departure_utc &&
          <ClockIcon className="scheduled-indicator" />
        }
        {disruptions &&
          <WarningIcon className="disruption-indicator" />
        }
      </div>
    ))}
  </section>
);

export default DirectionDepartures;
