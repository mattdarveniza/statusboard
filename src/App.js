import React from 'react';
import styled from 'styled-components';

import { bgColor, textColor } from './consts';
// import BoardSection from './components/BoardSection';
import Clock from './components/Clock';
import PTVDepartures from './components/PTVDepartures';
import BOMRadar from './components/BOMRadar';

const Frame = styled.main`
  display: grid;
  height: 100%;
  box-sizing: border-box;
  padding: 2em;
  grid-gap: 2em;
  grid-template: repeat(3, 1fr) / repeat(4, 1fr);
  background: ${bgColor};
  color: ${textColor};
`;

const App = () => (
  <Frame>
    <Clock timezone="Australia/Melbourne" position={[1, 1]} />
    <Clock timezone="Australia/Brisbane" position={[2, 1]} />
    <Clock timezone="America/Chicago" position={[3, 1]} />
    <PTVDepartures routeTypeId={0} stopId={1214} position={[1, 2]} />
    <PTVDepartures routeTypeId={1} stopId={2604} position={[1, 3, 2, 5]} />
    <BOMRadar id="IDR023.loop.shtml" />
    {/* <BoardSection>Sample Board</BoardSection>
    <BoardSection>Sample Board</BoardSection>
    <BoardSection>Sample Board</BoardSection>
    <BoardSection>Sample Board</BoardSection> */}
  </Frame>
);

export default App;
