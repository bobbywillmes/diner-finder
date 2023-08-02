import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './review.scss';
import { uploadPhoto, updatePhotoDetails } from '../../../api/business';
import { resizeImage } from '../../helpers/utils';

const StarRating = (props, { value }) => {
  const [rating, setRating] = React.useState(parseInt(value) || 0);
  const [selection, setSelection] = React.useState(0);

  const hoverOver = event => {
    let val = 0;
    if (event && event.target && event.target.parentNode.parentNode.parentNode.getAttribute('data-star-id'))
      val = event.target.parentNode.parentNode.parentNode.getAttribute('data-star-id');
    setSelection(val);
  };
  const Star = ({ marked, starId }) => {
    return (
      <span data-star-id={starId} className="star" role="button">
        {marked ?
          <span className="full"><FontAwesomeIcon icon={['fas', 'star']} /></span> :
          <span className="empty"><FontAwesomeIcon icon={['fas', 'star']} /></span>
        }
      </span>
    );
  }

  return (
    <div id="starRating"
      onMouseOut={() => hoverOver(null)}
      onClick={e => {
        props.handleChange(e)
        setRating(e.target.parentNode.parentNode.parentNode.getAttribute('data-star-id') || rating)
      }}
      onMouseOver={hoverOver}
    >
      {Array.from({ length: 5 }, (v, i) => (
        <Star
          starId={i + 1}
          key={`star_${i + 1}`}
          marked={selection ? selection >= i + 1 : rating >= i + 1}
        />
      ))}
    </div>
  );
}

function SuccessAlert(props) {
  const [show, setShow] = useState(true);

  if (props.updated) {
    setTimeout(() => {
      setShow(false)
    }, 2000)
  }

  return (
    <>
      <Alert show={show} variant="success" className="update-alert" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Success!</Alert.Heading>
        <p>
          Photo details updated.
        </p>
      </Alert>

    </>
  )
}

class SlideOne extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reviewRating: null,
      reviewText: null
    }
  }

  render() {
    return (
      <div id="slideOne">
        <Form id="reviewForm" onChange={this.props.handleChange} onSubmit={this.props.handleSubmit}>
          <Form.Group>
            <Form.Label>Rating</Form.Label>
            <StarRating handleChange={this.props.handleChange} />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label>Review Text</Form.Label>
            <Form.Control as="textarea" name="reviewText" rows="6" placeholder="The food was amazing. Our server was great & she even sang (& danced) happy birthday to my brother!" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <div className="note">Note: You'll be able to add images next.</div>
          <br />
        </Form>
      </div>
    )
  }
}

class SlideTwo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      image: null,
      resizedImage: null,
      newImages: []
    }
  }

  handleChange = (e) => {
    if (e.target.name === 'image') {
      const image = e.target.files[0]
      this.setState({ image: image })
    }
  }

  handleUpload = (e) => {
    e.preventDefault()
    this.props.handleUpload(this.state.image)
      .then(res => {
        if (res.status === 201) {
          let newImages = this.state.newImages
          newImages.push(res.data.image)
          this.setState({ newImages: newImages })
        }
      })
  }

  handleClose = () => {
    this.props.handleClose()
  }

  render() {
    return (
      <div id="slideTwo">
        <p className="h4">Review successfully submitted</p>
        <p className="h5">Now it's time to upload photos. (If you'd like to)</p>
        <hr />
        <div id="upload">
          <p>Upload photos, one at a time.</p>
          <form onSubmit={this.handleUpload}>
            <input id="imageUpload" type="file" name="image" onChange={this.handleChange} />
            <br />
            <button className="btn btn-secondary upload-btn">Upload</button>
          </form>
          <div id="newImages">
            {this.state.newImages.length > 0 ?
              <div>
                <p>New Images</p>
                {this.state.newImages.map(image => {
                  console.log(image)
                  return (
                    <img key={image.id} src={image.url} alt="" />
                  )
                })}
                <br /><br />
                <button onClick={this.props.nextSlide} className="btn btn-primary">Continue to image details</button>
              </div>
              :
              <div>
                <br />
                <hr />
                <p>Or don't, and finish the review without adding photos.</p>
                <button onClick={this.handleClose} className="btn btn-primary">Close</button>
              </div>
            }

          </div>
        </div>
      </div>
    )
  }
}

class ImageDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      description: '',
      category: undefined,
      updated: false
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleImageUpdate = (imageId, description, category) => {
    this.setState({ updated: false })
    // build formdata to update image info(description & category), send to API & return as a promise
    let formData = new FormData();
    formData.append('image[description]', description);
    formData.append('image[category]', category);
    return new Promise((resolve, reject) => {
      updatePhotoDetails(imageId, formData)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            this.setState({ updated: true })
            resolve({ resolved: true })
          } else {
            reject({ resolved: false })
          }
        })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.handleImageUpdate(this.props.image.id, this.state.description, this.state.category)
      .then(res => {
        console.log(res)
      })
  }

  render() {
    return (
      <div className="container" key={this.props.image.id}>
        {this.props.index > 0 ? <hr /> : ''}
        <div className="row">
          <div className="col-5">
            <img src={this.props.image.url} alt="" />
          </div>
          <div className="col-7">
            <div id="imageEdit">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea className="form-control" id="description" name="description" rows="3" value={this.state.description == null ? '' : this.state.description} onChange={this.handleChange} ></textarea>
                  <small id="descriptionHelp" className="form-text text-muted">How did it taste? What did you love about it?</small>
                </div>
                <div className="form-group">
                  <label htmlFor="category">What is the photo of?</label>
                  <select className="form-control" id="category" name="category" onChange={this.handleChange}>
                    <option>Make a selection</option>
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                    <option value="inside">Inside</option>
                    <option value="outside">Outside</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
              {this.state.updated &&
                <SuccessAlert updated={this.state.updated} />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

class SlideThree extends React.Component {
  handleClose = () => {
    this.props.handleClose()
  }

  render() {
    return (
      <div id="slideThree">
        <p>Now give your photos some info</p>
        {this.props.newImages.map((image, index) => {
          return (
            <div key={image.id}>
              <ImageDetails image={image} index={index} />
            </div>
          )
        })}
        <button className="btn btn-secondary" onClick={this.handleClose}>Close</button>
      </div>
    )
  }
}

class NewReview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSlideIndex: 0,
      reviewRating: null,
      reviewText: null,
      review_Id: null,
      image: null,
      resizedImage: null,
      newImages: [],
      readyToSubmit: null,
      business_id: null
    }
    this.slides = [
      <SlideOne
        business_id={this.props.business_id}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        reviewRating={this.state.reviewRating}
        reviewText={this.state.reviewText}
        readyToSubmit={this.state.readyToSubmit}
      />,
      <SlideTwo
        handleChange={this.handleChange}
        handleImageUpload={this.handleImageUpload}
        handleUpload={this.handleUpload}
        handleClose={this.props.handleClose}
        review_Id={this.state.review_Id}
        business_id={this.props.business_id}
        newImages={this.state.newImages}
        nextSlide={this.nextSlide}
      />,
      <SlideThree
        newImages={this.state.newImages}
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

  handleUpload = (image) => {
    return new Promise((resolve, reject) => {
      console.log(image)
      console.log(this.state)
      let formData = new FormData()
      resizeImage(image)
        .then(res => {
          console.log(res)
          console.log(this.props)
          this.setState({ resizedImage: res })
          console.log(this.state)
          formData.append('image[image]', res)
          formData.append('image[business_id]', this.props.business_id)
          formData.append('image[user_id]', this.props.user_id)
          formData.append('image[review_id]', this.state.review_Id)
          uploadPhoto(this.props.business_id, formData)
            .then(res => {
              console.log(res)
              if (res.status === 201) {
                console.log('image uploaded!')
                console.log(res)
                let newImages = this.state.newImages
                newImages.push(res.data.image)
                this.setState({ newImages: newImages })
                console.log(this.state)
                const uploadForm = document.querySelector('#imageUpload')
                uploadForm.value = null
                resolve(res)
                // this.props.alert.success('Image uploaded!')
              }
            })
            .catch(err => {
              console.log(err)
              reject(err)
            })
        })
    })
  }

  handleChange = (e) => {
    setTimeout(() => {
      let starRating = e.target.parentNode.parentNode.parentNode.getAttribute('data-star-id')
      if (starRating) {
        starRating = Number(starRating)
        this.setState({ reviewRating: starRating })
      }
      if (e.target.name === 'reviewText') {
        const reviewText = e.target.value
        this.setState({ reviewText: reviewText })
      }
      if (e.target.name === 'image') {
        const image = e.target.files[0]
        this.setState({ image: image })
      }
      if (!this.state.reviewRating || this.state.reviewText == '') {
        this.setState({ readyToSubmit: false })
      } else {
        this.setState({ readyToSubmit: true })
      }
    }, 100);
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let reviewFormData = new FormData()
    reviewFormData.append('review[text]', this.state.reviewText)
    reviewFormData.append('review[rating]', this.state.reviewRating)
    this.props.handleReviewSubmit(reviewFormData)
      .then(res => {
        const apiRes = res.apiRes
        if (apiRes.status === 201) {
          this.setState({ review_Id: apiRes.data.review.id })
          this.nextSlide()
        }
      })
      .catch(error => {
        console.log(error)
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
      <div id="slides">
        {this.renderSlide()}
      </div>
    )
  }

  render() {
    return (
      <div id="postReview">
        {this.renderSlideSection()}
      </div>
    );
  }

}



export default NewReview