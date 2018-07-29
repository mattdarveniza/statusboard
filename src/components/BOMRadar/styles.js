import BoardSection from '../BoardSection';

const BOMRadarSection = BoardSection.extend`
  padding: 1.5em;

  .imageWrapper {
    position: relative;
    margin: 0 auto;
    height: 100%;
  }

  img {
    filter: invert(100%) grayscale(100%);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-50%);
  }

  .background {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: red;
      z-index: 2;
    }
  }

  .radar-overlay {
    filter: none;
    visibility: hidden;
    opacity: 0.5;

    &.active {
      visibility: visible;
    }
  }
`;

export default BOMRadarSection;
