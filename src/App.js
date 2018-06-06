import React from 'react';
import styled from 'styled-components';

import { bgColor, textColor } from './consts';
import Clock from './components/Clock';
import BoardSection from './components/BoardSection';

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
    <BoardSection>Sample Board</BoardSection>
    <BoardSection>Sample Board</BoardSection>
    <BoardSection>Sample Board</BoardSection>
    <BoardSection>Sample Board</BoardSection>
  </Frame>
);

export default App;
