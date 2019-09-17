import React, { Component } from 'react';
import photoApi from '../../api/photo';

import styles from './style.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCanvasFilled: false,
    };

    this.video = React.createRef();
    this.canvas = React.createRef();
    this.startButton = React.createRef();

    this.width = 320;
    this.height = 0;

    this.streaming = false;
  }

  componentDidMount() {
    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    navigator.getMedia(
      { video: true, audio: false },
      stream => {
        this.video.current.srcObject = stream;
        this.video.current.play();
      },
      error => console.warn('An error occurred:', error),
    );
  }

  handleCanPlay = () => {
    if (!this.streaming) {
      this.height = this.video.current.videoHeight / (this.video.current.videoWidth / this.width);

      this.video.current.setAttribute('width', this.width);
      this.video.current.setAttribute('height', this.height);
      this.canvas.current.setAttribute('width', this.width);
      this.canvas.current.setAttribute('height', this.height);
      this.streaming = true;
    }
  };

  handleClick = e => {
    e.preventDefault();
    const context = this.canvas.current.getContext('2d');

    if (this.width && this.height) {
      this.canvas.current.width = this.width;
      this.canvas.current.height = this.height;

      context.drawImage(this.video.current, 0, 0, this.width, this.height);

      this.setState(prevState => {
        if (!prevState.isCanvasFilled) {
          return { isCanvasFilled: !prevState.isCanvasFilled };
        }
      });
    } else {
      this.clearPhoto();
    }
  };

  clearPhoto = () => {
    const context = this.canvas.current.getContext('2d');
    context.fillStyle = '#AAA';
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  uploadImg = () => {
    const img = this.canvas.current.toDataURL('image/png');

    fetch(img)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('file', blob, `Snapshot_${new Date().toISOString()}.png`);

        photoApi.upload(formData).then(res => console.warn('res', res));
      });
  };

  downloadImg = () => {
    this.canvas.current.toBlob(blob => {
      let link = document.createElement('a');
      link.download = `Snapshot_${new Date().toISOString()}.png`;

      link.href = URL.createObjectURL(blob);
      link.click();

      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };

  render() {
    const {
      state: { isCanvasFilled },
      width,
      height,
    } = this;

    return (
      <>
        <h1>Webcam broadcast with snapshot func</h1>
        <div className={styles.Container}>
          <video ref={this.video} onCanPlay={this.handleCanPlay}>
            Video stream not available.
          </video>
          <div className={styles.Home__canvas} style={{ width, height }}>
            <canvas ref={this.canvas} />
            {isCanvasFilled && (
              <>
                <button onClick={this.downloadImg} className={styles.Home__button_dowload}>
                  Download
                </button>
                <button onClick={this.uploadImg} className={styles.Home__button_upload}>
                Upload
                </button>
              </>
            )}
          </div>
        </div>
        <button
          ref={this.startButton}
          onClick={this.handleClick}
          className={styles.Home__button_snapshot}
        >
          Take photo
        </button>
      </>
    );
  }
}

export default Home;
