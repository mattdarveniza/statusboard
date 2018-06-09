import BoardSection from '../BoardSection';

const DepartureSection = BoardSection.extend`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(2, 1fr);

  header {
    grid-column: 1 / 3;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-size: 1em;
    margin: 0;
  }

  h2 {
    font-size: 0.75em;
    text-align: center;
    margin: 0;
  }

  .direction {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  .departing-duration {

    &.next {
      font-size: 2em;
    }

    svg {
      display: inline-block;
      height: 0.75em;
      vertical-align: text-top;

      &.live-indicator {
        transform: translateY(-0.25em) rotate(45deg);
      }

      &.disruption-indicator {
        transform: translateY(-0.25em);
        fill: #ffdf13;
      }
    }
  }

  .duration-number {
    font-size: 2em;
  }
`;

export default DepartureSection;
