import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import photoApi from '../../api/photo';

class Snapshot extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  state = {
    imgSrc: null,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    console.warn('id', id);
    if (id) {
      photoApi.uploadById(id).then(res => {
        this.setState({ imgSrc: res.config.url });
        console.warn('res', res.config.url);
      });
    }
  }

  render() {
    return <img alt="One of uploaded images" src={this.state.imgSrc} />
  }
}

export default withRouter(Snapshot);
