// @flow

import React from 'react';
import type { Element } from 'react';
import moment from 'moment-timezone';

// $FlowFixMe
import { ReactComponent as ClockIcon } from '../../images/Clock.svg';
// $FlowFixMe
import { ReactComponent as WarningIcon } from '../../images/Warning.svg';

import type { Departure } from '.';

type Props = {
  departures: Array<Departure>,
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

const DirectionDepartures = ({
  departures,
  now,
  name,
  disruptions,
}: Props) => (
  <section className="direction">
    <h2>To {name}</h2>
    {departures.map((departure, i) => (
      <div
        className={`departing-duration${i === 0 ? ' next' : ''}`}
        key={departure ? departure.scheduled_departure_utc : i}
      >
        {departure
          ? (<>
            {getDepartureDuration(departure, now)}
            {!departure.estimated_departure_utc &&
              <ClockIcon className="scheduled-indicator" />
            }
            {disruptions &&
              <WarningIcon className="disruption-indicator" />
            }
          </>)
          : '&ndash;'
        }
      </div>
    ))}
  </section>
);

export default DirectionDepartures;
