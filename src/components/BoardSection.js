import styled, { css } from 'styled-components';

import { borderRadius } from '../consts';

const BoardSection = styled.section`
  border-radius: ${borderRadius}
  display: flex;
  justify-content: center;
  align-items: center;
  background: #232323;
  padding: 1.5em;

  ${({ position }) => position && css`
    grid-area: ${position[0]} / ${position[1]} / ${position[0] + 1} / ${position[1] + 1};
  `}
`;

export default BoardSection;
