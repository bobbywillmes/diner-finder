import React, { Component, useState, useEffect } from 'react';
import './photoUpload.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Images(props) {
  if (props.newImages.length > 0) {
    return (
      <div id="images">
        <h3>New Images</h3>
        {props.newImages.map(image => {
          return (
            <img src={image.src} key={image.id} alt="" />
          )
        })}
      </div>
    )
  }
}

function SlideOne(props) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setImages(e.target.files);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    props.handleUpload([...images])
      .then(res => {
        if (res.success) {
          document.getElementById('imagesInput').value = [];
          setImages(res.images);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div id="slideOne">
      <h4>Upload one or more photos</h4>
      <form onSubmit={handleSubmit}>
        <input id="imagesInput" type="file" name="images" onChange={handleChange} multiple={true} />
        <br />
        <button className="btn btn-info">Upload Photos</button>
      </form>
      <Images newImages={props.newImages} />
      {props.newImages.length > 0 ?
        <>
          <br />
          <button className="btn btn-success" onClick={props.nextSlide}>Continue to image details</button>
        </>
        : '(no new images yet)'
      }
      {loading ?
        <div className="iconWrap">
          <FontAwesomeIcon icon={['fas', 'sync']} className="fa-spin" />
        </div>
        : ''
      }
    </div>
  )
}

function ImageDetails(props) {
  const image = props.image;
  const [description, setDescription] = useState(null);
  const [category, setCategory] = useState(null);
  const [saved, setSaved] = useState(false);
  const updateDescription = (e) => {
    setSaved(false);
    setDescription(e.target.value);
  }
  const updateCategory = (e) => {
    setSaved(false);
    setCategory(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      description: description,
      category: category
    }
    props.handleImageUpdate(image.id, data)
      .then(res => {
        if (res.status === 200) {
          setSaved(true)
        }
      })
  }
  return (
    <div className="row imageDetails" key={image.id}>
      <div className="col-4">
        <img src={image.src} alt="" />
      </div>
      <div className="col-8">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" name="description" rows="3" value={description == null ? '' : description} onChange={updateDescription} ></textarea>
            <small id="descriptionHelp" className="form-text text-muted">How did it taste? What did you love about it?</small>
          </div>
          <div className="form-group">
            <label htmlFor="category">What is the photo of?</label>
            <select className="form-control" id="category" name="category" onChange={updateCategory}>
              <option>Make a selection</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">Save</button>
          {saved ?
            <span className="saved"> <FontAwesomeIcon className="saved-icon" icon={['fas', 'circle-check']} />  Image details saved</span>
            : ''}
        </form>
      </div>
    </div>
  )
}

function SlideTwo(props) {
  const [images, setImages] = useState(props.newImages);
  useEffect(() => {
    setImages(props.newImages)
  }, [props])

  return (
    <div>
      <h4>Image Details</h4>
      <p>Give some details to your images.</p>
      <div className="container">
        {images.map(image => {
          return (
            <ImageDetails image={image} key={image.id} handleImageUpdate={props.handleImageUpdate} />
          )
        })}
        <button className="btn btn-secondary" onClick={props.handleClose}>Close</button>
      </div>
    </div>
  )
}

class PhotoUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlideIndex: 0,
      newImages: []
    }
    this.slides = [
      <SlideOne
        handleUpload={this.handleUpload}
        newImages={this.state.newImages}
        nextSlide={this.nextSlide}
      />,
      <SlideTwo
        newImages={this.state.newImages}
        handleImageUpdate={this.props.handleImageUpdate}
        handleClose={this.props.handleClose}
      />
    ]
  }
  previousSlide = () => {
    const newSlideIndex = this.state.currentSlideIndex - 1
    this.setState({ currentSlideIndex: newSlideIndex })
  }
  nextSlide = () => {
    const newSlideIndex = this.state.currentSlideIndex + 1
    this.setState({ currentSlideIndex: newSlideIndex })
  }

  handleUpload = (images) => {
    let newImages = this.state.newImages;
    // loop through (new) images, upload each image, then if it's the last image resolve the Promise with all new images.
    return new Promise((resolve, reject) => {
      images.forEach((image, index) => {
        this.props.uploadNewImage(image)
          .then(res => {
            if (res.status === 201) {
              newImages.push(res.data.image);
              if (index === images.length - 1) {
                this.setState({ newImages: newImages });
                let response = {
                  images: newImages,
                  success: true
                }
                resolve(response);
              }
            }
          })
          .catch(err => {
            console.log(err);
            reject(err)
          })
      })
    })
  }

  renderSlide = () => {
    const slide = this.slides[this.state.currentSlideIndex];

    return (
      <TransitionGroup className="slide-group">
        <CSSTransition
          classNames="slide"
          timeout={{ enter: 500, exit: 500 }}
          key={`${this.state.currentSlideIndex}`}
        >
          <div id="slideWrap">
            {slide}
          </div>
        </CSSTransition>
      </TransitionGroup>
    )
  }

  renderSlideSection = () => {
    return (
      <div id="photoUploadSlides">
        {this.renderSlide()}
      </div>
    )
  }

  render() {
    return (
      <div id="photoUpload">
        {this.renderSlideSection()}
      </div>
    );
  }
}


export default PhotoUpload