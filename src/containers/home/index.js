import React, { Component } from 'react';
import cn from 'classnames';
import html2canvas from 'html2canvas';
import photoApi from '../../api/photo';
import Select from '../../components/elements/select';
import glassFilter from '../../libs/jeelizFaceFilter/filters/comedy-glasses';

import styles from './style.scss';

const PATH_TO_NNC_FILE = '../../libs/jeelizFaceFilter/NNC.json';
const FACE_FILTER_CANVAS = 'jeeFaceFilterCanvas';
const FILTER_OPTIONS = [
  'invert(1)',
  'blur(1px)',
  'brightness(2)',
  'contrast(2)',
  'grayscale(1)',
  'hue-rotate(90deg)',
  'saturate(3)',
  'sepia(1)',
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCanvasFilled: false,
      isUploading: false,
      uploadedFiles: [],
      filter: '',
    };

    this.video = React.createRef();
    this.canvas = React.createRef();
    this.startButton = React.createRef();
    this.glasses = React.createRef();
    this.face = React.createRef();

    this.width = 400;
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
        // this.video.current.srcObject = stream;
        // this.video.current.play();
        glassFilter(this.glasses.current, FACE_FILTER_CANVAS, PATH_TO_NNC_FILE);
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
    const { filter } = this.state;

    html2canvas(document.body, { backgroundColor: 'red' }).then(function(canvas) {
      document.body.appendChild(canvas);
    });

    // e.preventDefault();
    // const context = this.canvas.current.getContext('2d');
    //
    // if (this.width && this.height) {
    //   this.canvas.current.width = this.width;
    //   this.canvas.current.height = this.height;
    //
    //   context.filter = filter;
    //   context.drawImage(this.video.current, 0, 0, this.width, this.height);
    //
    //   this.setState(prevState => {
    //     if (!prevState.isCanvasFilled) {
    //       return { isCanvasFilled: !prevState.isCanvasFilled };
    //     }
    //   });
    // } else {
    //   this.clearPhoto();
    // }
  };

  clearPhoto = () => {
    const context = this.canvas.current.getContext('2d');
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  uploadImg = () => {
    const img = this.canvas.current.toDataURL('image/png');
    this.setState({ isUploading: true });

    fetch(img)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('file', blob, `Snapshot_${Date.now()}.png`);

        return photoApi.upload(formData).then(({ data }) => {
          this.setState(prevState => {
            return {
              uploadedFiles: [...prevState.uploadedFiles, data],
              isUploading: false,
            };
          });
        });
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  downloadImg = () => {
    this.canvas.current.toBlob(blob => {
      let link = document.createElement('a');
      link.download = `Snapshot_${Date.now()}.png`;

      link.href = URL.createObjectURL(blob);
      link.click();

      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };

  renderUploadedFiles = filesArr => {
    return filesArr.map(({ name, url }) => {
      return (
        <li key={name}>
          <a href={url} target="_blank">
            {name}
          </a>
        </li>
      );
    });
  };

  handleFilterChange = ({ target }) => this.setState({ filter: target.value });

  render() {
    const {
      state: { isUploading, isCanvasFilled, uploadedFiles, filter },
      width,
      height,
    } = this;

    return (
      <>
        <h1>Webcam broadcast with snapshot func</h1>
        <div className={styles.Container}>
          <div className={styles.Home__video}>
            <div ref={this.glasses} id='jeelizFaceFilterFollow' />
            <canvas ref={this.face} width="1024" height="1024" id={FACE_FILTER_CANVAS} style={{ filter }} />
            <div className={styles.Home__controls}>
              <Select
                value={filter}
                onChange={this.handleFilterChange}
                options={FILTER_OPTIONS}
                placeholder="Choose filter"
                className={styles.Home__select_filter}
              />
              <button
                ref={this.startButton}
                onClick={this.handleClick}
                className={styles.Home__button_snapshot}
              >
                Take photo
              </button>
            </div>
          </div>
          <div className={styles.Home__canvas} style={{ width, height }}>
            <canvas ref={this.canvas} />
            {isCanvasFilled && (
              <>
                <button onClick={this.downloadImg} className={styles.Home__button_dowload}>
                  Download
                </button>
                <button
                  onClick={this.uploadImg}
                  disabled={isUploading}
                  className={cn(
                    styles.Home__button_upload,
                    isUploading && styles.Home__button_disabled,
                  )}
                >
                  Upload
                </button>
              </>
            )}
          </div>
        </div>
        {!!uploadedFiles.length && (
          <div className={styles.Home__uploads}>
            <h4>Your uploaded files:</h4>
            <ul>{this.renderUploadedFiles(uploadedFiles)}</ul>
          </div>
        )}
      </>
    );
  }
}

export default Home;
