import BoardSection from '../BoardSection';

const DepartureSection = BoardSection.extend`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  header {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
  }

  h1 {
    font-size: 1em;
    margin: 0;
  }

  h2 {
    font-size: 0.9em;
    text-align: center;
    margin: 0;
  }

  .departures {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: 1;
    grid-gap: 1em;
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
      transform: translateY(-0.25em);

      &.disruption-indicator {
        fill: #ffdf13;
      }
    }
  }

  .duration-number {
    font-size: 2em;
  }

  .train {
    fill: #4fb8ff
  }

  .tram {
    fill: #71ce45
  }

  .bus {
    fill: #ffac15
  }

  .vline {
    fill: #cc3aae
  }
`;

export default DepartureSection;
