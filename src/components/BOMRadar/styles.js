import BoardSection from '../BoardSection';

const BOMRadarSection = BoardSection.extend`
  padding: 1.5em;

  .imageWrapper {
    position: relative;
    margin: 0 auto;
    height: 100%;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-50%);
  }

  .radar-overlay {
    visibility: hidden;

    &.active {
      visibility: visible;
    }
  }
`;

export default BOMRadarSection;
