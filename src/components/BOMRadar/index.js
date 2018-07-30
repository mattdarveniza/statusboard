// @flow

import React, { Component } from 'react';
import classnames from 'classnames';

import BOMRadarSection from './styles';

// TODO: Figure out why require works but import doesn't
const esprima = require('esprima');

const LOOP_INTERVAL_SECONDS = 1;
const REFRESH_INTERVAL_MINUTES = 5;

type Props = {
  id: string,
  position: [number, number],
}

type State = {
  imageUrls: null | Array<string>,
  currentImageIndex: number
}

class BOMRadarBoard extends Component<Props, State> {
  radarLoopIntervalId: number;
  refreshIntervalId: number;

  constructor() {
    super();

    this.state = {
      imageUrls: null,
      currentImageIndex: 0,
    };
  }

  componentDidMount() {
    this.fetchImageUrls();

    // refresh images every 5 minutes
    this.refreshIntervalId = window.setInterval(
      this.fetchImageUrls.bind(this),
      REFRESH_INTERVAL_MINUTES * 60 * 1000,
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.refreshIntervalId);
    window.clearInterval(this.radarLoopIntervalId);
  }

  async fetchImageUrls() {
    // Fetch page and parse as text
    const response = await fetch(`/products/${this.props.id}.loop.shtml`);
    const htmlText = await response.text();

    // Inject contents into a template tag to create a DOM to query
    const template = document.createElement('template');
    template.innerHTML = htmlText.trim();

    // Use queryseletcor and find to find the script tag we're looking for
    const scripts = template.content.querySelectorAll('#content script');
    const imageNamesScript = [...scripts].find(script => (
      script.innerText
      && script.innerText.includes('theImageNames')));
    if (!imageNamesScript) {
      throw Error('No script with image names found');
    }

    // Parse script into an AST so we can pull out the line fragments needed
    const ast = esprima.parse(imageNamesScript.innerText);
    const imageUrls = ast.body.filter(exp => (
      exp.type === 'ExpressionStatement'
      && exp.expression.type === 'AssignmentExpression'
      && exp.expression.left.type === 'MemberExpression'
      && exp.expression.left.object.name === 'theImageNames'
      && exp.expression.right.type === 'Literal'
    )).map(exp => exp.expression.right.value);
    this.setState({ imageUrls });
    this.startRadarLoop();
  }

  startRadarLoop() {
    if (this.state.imageUrls && this.state.imageUrls.length > 0) {
      if (this.radarLoopIntervalId) {
        window.clearInterval(this.radarLoopIntervalId);
      }

      this.radarLoopIntervalId = window.setInterval(() => {
        let nextImageIndex = this.state.currentImageIndex + 1;
        if (this.state.imageUrls && nextImageIndex >= this.state.imageUrls.length) {
          nextImageIndex = 0;
        }
        this.setState({ currentImageIndex: nextImageIndex });
      }, LOOP_INTERVAL_SECONDS * 1000);
    }
  }

  render() {
    return (
      <BOMRadarSection position={this.props.position}>
        {!this.state.imageUrls
          ? 'Loading...'
          : (
            <div className="imageWrapper">
              <img
                className="background"
                src={`/products/radar_transparencies/${this.props.id}.background.png`}
                alt="background"
              />
              <img
                className="locations"
                src={`/products/radar_transparencies/${this.props.id}.locations.png`}
                alt="locations"
              />
              <img
                className="range"
                src={`/products/radar_transparencies/${this.props.id}.range.png`}
                alt="range indicator"
              />
              {this.state.imageUrls.map((imageUrl, index) => (
                <img
                  key={imageUrl}
                  src={imageUrl}
                  alt={`Radar ${index + 1}`}
                  className={classnames(
                  'radar-overlay',
                  { active: this.state.currentImageIndex === index },
                )}
                />
            ))}
            </div>
          )
        }
      </BOMRadarSection>
    );
  }
}

export default BOMRadarBoard;
