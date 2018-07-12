// @flow

import React, { Component } from 'react';

import BoardSection from '../BoardSection';

// const BOM_RADAR_BASE_URL = '//www.bom.gov.au/products/';

const BOMRadarSection = BoardSection.extend`
`;

type Props = {
  id: string
}

type State = {}

class BOMRadarBoard extends Component<Props, State> {
  componentDidMount() {
    this.fetchImageUrls();
  }

  async fetchImageUrls() {
    const response = await fetch(`/products/${this.props.id}`);
    const htmlText = await response.text();
    const template = document.createElement('template');
    template.innerHTML = htmlText.trim();
    const scripts = template.content.querySelectorAll('#content script');
    const imageNamesScript = [...scripts].find(script => (
      script.innerText
      && script.innerText.includes('theImageNames')));
    debugger;
    // TODO: Regex or AST parse script to pull out image URLs
  }

  render() {
    return (
      <BOMRadarSection>
        Radar!
      </BOMRadarSection>
    );
  }
}

export default BOMRadarBoard;
