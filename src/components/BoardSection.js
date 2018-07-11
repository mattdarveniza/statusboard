// @flow
import styled, { css } from 'styled-components';

import { borderRadius, panelBgColor } from '../consts';

type Position = [number, number, ?number, ?number];

const BoardSection = styled.section`
  border-radius: ${borderRadius}
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${panelBgColor};
  padding: 1.5em;

  ${({ position }: { position: Position }) => position && css`
    grid-area:
      ${position[0]}
      / ${position[1]}
      / ${position[2] || position[0] + 1}
      / ${position[3] || position[1] + 1};
  `}
`;

export default BoardSection;
