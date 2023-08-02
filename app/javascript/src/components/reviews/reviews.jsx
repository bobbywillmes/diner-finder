import React from 'react';
import { Fragment } from 'react';
import { formatDateTime } from '../../helpers/utils';
import { AvgRating, ReviewStars } from '../rating/rating.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import './review.scss';

function SlideButtons(props) {
  // return no buttons
  if (props.imagesLength === 1) {
    return true
  }
  // if first slide, disable previous button
  if (props.activeSlide === 0) {
    return (
      <Fragment>
        <FontAwesomeIcon icon={['fas', 'arrow-circle-left']} className="previous fa-2x disabled" />
        <FontAwesomeIcon icon={['fas', 'arrow-circle-right']} className="next fa-2x" onClick={props.nextImage} />
      </Fragment>
    )
  }
  // if last slide, disable next button
  if (props.activeSlide == props.imagesLength - 1) {
    return (
      <Fragment>
        <FontAwesomeIcon icon={['fas', 'arrow-circle-left']} className="previous fa-2x" onClick={props.previousImage} />
        <FontAwesomeIcon icon={['fas', 'arrow-circle-right']} className="next fa-2x disabled" />
      </Fragment>
    )
  }
  // else, return both buttons
  return (
    <Fragment>
      <FontAwesomeIcon icon={['fas', 'arrow-circle-left']} className="previous fa-2x" onClick={props.previousImage} />
      <FontAwesomeIcon icon={['fas', 'arrow-circle-right']} className="next fa-2x" onClick={props.nextImage} />
    </Fragment>
  )
}

class ReviewImage extends React.Component {
  state = {
    show: false,
    image: {},
    date: undefined
  }

  setShow = (boolean) => {
    this.setState({ show: boolean })
  }

  componentDidMount() {
    this.setState({ image: this.props.image })
    const date = formatDateTime(new Date(this.props.image.date))
    this.setState({ date: date })
  }

  previousImage = () => {
    this.props.previousImage()
      .then(newImage => {
        this.setState({ image: newImage })
      })
  }

  nextImage = () => {
    this.props.nextImage()
      .then(newImage => {
        this.setState({ image: newImage })
      })
  }

  render() {
    return (
      <Fragment key={this.props.image.id}>
        <img src={this.props.image.src} onClick={() => {
          this.setShow(true)
          this.props.openModal(this.props.index)
        }} />

        <Modal
          show={this.state.show}
          onHide={() => this.setShow(false)}
          onShow={() => this.setState({ image: this.props.image })}
          dialogClassName="review-images-modal"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <div className="row">
                <div className="col-8 imageCol">
                  <div className="imgWrap">
                    <img src={this.state.image.src} alt="" />
                    <SlideButtons activeSlide={this.props.activeSlide} imagesLength={this.props.imagesLength} nextImage={this.nextImage} previousImage={this.previousImage} />
                  </div>
                </div>
                <div className="col-4">
                  <span>({this.props.activeSlide + 1} / {this.props.imagesLength})</span>
                  <br />
                  {this.state.image.category ?
                    <span>({this.state.image.category})</span>
                    : null
                  }
                  {this.state.image.description ?
                    <h4>{this.state.image.description}</h4>
                    : null
                  }
                  <h6>by {this.props.userName} on {this.state.date}</h6>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }
}

class ReviewImages extends React.Component {
  state = {
    images: [],
    image: null,
    activeSlide: null
  }

  componentDidMount() {
    this.setState({ images: this.props.images })
  }

  previousImage = () => {
    const newIndex = this.state.activeSlide - 1
    this.setState({ activeSlide: newIndex })
    const newImage = this.state.images[newIndex]
    this.setState({ image: newImage })
    return new Promise((resolve, reject) => {
      if (newImage) {
        return resolve(newImage)
      }
    })
  }

  nextImage = () => {
    const newIndex = this.state.activeSlide + 1
    this.setState({ activeSlide: newIndex })
    const newImage = this.state.images[newIndex]
    this.setState({ image: newImage })
    return new Promise((resolve, reject) => {
      if (newImage) {
        return resolve(newImage)
      }
    })
  }

  openModal = (index) => {
    const newImage = this.state.images[index]
    this.setState({ image: newImage })
    this.setState({ activeSlide: index })
  }

  render() {
    if (this.props.images == undefined || this.props.images.length === 0) {
      return
    }
    return (
      <div className="images">
        {this.props.images.map((image, index) => {
          return (
            <ReviewImage key={index} image={image} images={this.props.images} nextImage={this.nextImage} previousImage={this.previousImage} index={index} openModal={this.openModal} activeSlide={this.state.activeSlide} imagesLength={this.props.images.length} userName={this.props.userName} userLocation={this.props.userLocation} />
          )
        })}
      </div>
    )
  }
}

class Review extends React.Component {
  state = {
    date: undefined
  }

  componentDidMount() {
    let date = formatDateTime(new Date(this.props.review.date))
    this.setState({ date: date })
  }

  handleDelete = (e) => {
    this.props.handleReviewDelete(this.props.review.id)
  }

  render() {
    return (
      <div className="review">
        <div className="header">
          <div className="author">
            <FontAwesomeIcon icon={['fas', 'user']} className="icon" />
            {this.props.review.userName} <br /> {this.props.review.userLocation}
          </div>
          <div className="date">
            {this.state.date}
          </div>
        </div>
        <ReviewStars rating={this.props.review.rating} />
        <p>{this.props.review.text}</p>
        {this.props.user_id == this.props.review.user_id ?
          <button className="btn btn-danger delete" onClick={this.handleDelete}>Delete Review</button> : ''
        }
        <ReviewImages images={this.props.review.images} userName={this.props.review.userName} userLocation={this.props.review.userLocation} />
      </div>
    )
  }
}

class Reviews extends React.Component {
  render() {
    return (
      <div id="reviews">
        <AvgRating reviewsSummary={this.props.reviewsSummary} />
        {this.props.reviews.map(review => {
          return (
            <Review key={review.id} review={review} user_id={this.props.user_id} handleUpload={this.props.handleUpload} handleInputChange={this.props.handleInputChange} handleReviewDelete={this.props.handleReviewDelete} />
          )
        })}
      </div>
    )
  }
}

export { Reviews }