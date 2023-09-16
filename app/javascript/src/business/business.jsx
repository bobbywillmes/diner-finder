import React from 'react';
import { useState } from 'react';
import { getBusiness, uploadPhoto, deletePhoto, updatePhotoDetails, postReview, getReviews, deleteReview, updateBusiness } from '../../api/business';
import NewReview from '../components/reviews/newReview';
import { AvgRating } from '../components/rating/rating';
import { Reviews } from '../components/reviews/reviews';
import Gallery from '../components/gallery/gallery';
import Editor from '../components/editor/editor';
import PhotoUpload from '../components/photoUpload/photoUpload';
import { apiAuthenticated } from '../../api/user';
import { Categories, parseCategories, resizeImage } from '../helpers/utils';
import { withAlert } from 'react-alert';
import { Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';

function PhotoGalleryBtn(props) {
  // button to show modal with Gallery component
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button id="photoGalleryBtn" onClick={handleShow}>
        See all photos
      </Button>
      <Modal id="galleryModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Photos for {props.bizName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="galleryWrap">
            <Gallery
              images={props.images}
              bizId={props.bizId}
              authenticated={props.authenticated}
              user_id={props.user_id}
              updatePrimaryImage={props.updatePrimaryImage}
              isBusinessOwner={props.isBusinessOwner}
              handleImageUpdate={props.handleImageUpdate}
              handleImageDelete={props.handleImageDelete}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

function UploadPhotoBtn(props) {
  // button to show modal with PhotoUpload component
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!props.authenticated) {
    return (
      <a href='/login'>Login to upload photos.</a>
    )
  }

  return (
    <>
      <Button id="uploadPhotoBtn" onClick={handleShow}>Upload Photos</Button>
      <Modal id="uploadPhotoModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload photos for {props.business.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="uploadPhotoWrap">
            <PhotoUpload
              uploadNewImage={props.uploadNewImage}
              handleImageUpdate={props.handleImageUpdate}
              handleClose={handleClose}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

function PostReviewBtn(props) {
  // button to show modal with NewReview component
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!props.authenticated) {
    return (
      <a href='/login'>Login to post a review.</a>
    )
  }

  return (
    <>
      <Button id="postReviewBtn" onClick={handleShow}>
        Post a Review
      </Button>
      <Modal id="reviewModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Post a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewReview
            handleReviewSubmit={props.handleReviewSubmit}
            business_id={props.business_id}
            user_id={props.user_id}
            handleClose={handleClose}
            uploadNewImage={props.uploadNewImage}
            handleImageUpdate={props.handleImageUpdate}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

function checkIfAuthenticated() {
  return new Promise((resolve, reject) => {
    apiAuthenticated()
      .then(res => {
        if (res.data.authenticated) {
          resolve({
            authenticated: true,
            user_id: res.data.user_id,
            data: res.data
          })
        } else {
          reject({ authenticated: false })
        }
      })
  })
}

function getBusinessData(bizId) {
  return new Promise((resolve, reject) => {
    getBusiness(bizId)
      .then(res => {
        if (res.status === 200) {
          resolve({
            business: res.data.business
          })
        } else {
          reject({ note: 'failed to getBusiness()' })
        }
      })
      .catch(err => console.log(err))
  })
}

function PrimaryPhoto(props) {
  if (!props.photo) {
    return
  } else if (props.photo.isPlaceholder) {
    return (
      <div id="primaryPhoto">
        <img src={props.photo.src} alt="" />
      </div>
    )
  } else {
    return (
      <div id="primaryPhoto">
        <img src={props.photo.src} alt="" />
        <PhotoGalleryBtn
          images={props.images}
          bizName={props.bizName}
          bizId={props.bizId}
          authenticated={props.authenticated}
          user_id={props.user_id}
          isBusinessOwner={props.isBusinessOwner}
          updatePrimaryImage={props.updatePrimaryImage}
          handleImageUpdate={props.handleImageUpdate}
          handleImageDelete={props.handleImageDelete}
        />
      </div>
    )
  }
}

function EditBusinessBtn(props) {
  // button to show modal with business Editor component
  if (!props.isBusinessOwner) {
    return
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button id="editBusinessBtn" onClick={handleShow}>
        Edit Business
      </Button>
      <Modal id="editorModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {props.business.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="editorWrap">
            <Editor business={props.business} updateBusiness={props.updateBusiness} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

function About(props) {
  if (!props.about) {
    return
  }
  return (
    <div id="about">
      <h3>About</h3>
      <p>{props.about}</p>
      {props.history ?
        <>
          <h3>History</h3>
          <p>{props.history}</p>
        </>
        : <div></div>}
    </div>
  )
}

function Hours(props) {
  const date = new Date();
  const day = date.getDay();
  if (!props.hours) {
    return
  }
  return (
    <div id="hours">
      <h3>Hours of operation</h3>
      <table>
        <thead>
          <tr>
            <th>Day of Week</th>
            <th>Hours of Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monday</td>
            <td>{props.hours.Mon} {day == 1 ? <span>(Today)</span> : ''}</td>
          </tr>
          <tr>
            <td>Tuesday</td>
            <td>{props.hours.Tue} {day == 2 ? <span>(Today)</span> : ''}</td>
          </tr>
          <tr>
            <td>Wednesday</td>
            <td>{props.hours.Wed} {day == 3 ? <span>(Today)</span> : ''}</td>
          </tr>
          <tr>
            <td>Thursday</td>
            <td>{props.hours.Thu} {day == 4 ? <span>(Today)</span> : ''}</td>
          </tr>
          <tr>
            <td>Friday</td>
            <td>{props.hours.Fri} {day == 5 ? <span>(Today)</span> : ''}</td>
          </tr>
          <tr>
            <td>Saturday</td>
            <td>{props.hours.Sat} {day == 6 ? <span>(Today)</span> : ''}</td>
          </tr>
          <tr>
            <td>Sunday</td>
            <td>{props.hours.Sun} {day == 0 ? <span>(Today)</span> : ''}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function Price(props) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      (Price scaled one to four)
    </Tooltip>
  );

  return (
    <div>
      <OverlayTrigger
        placement="top"
        delay={{ show: 0, hide: 1000 }}
        overlay={renderTooltip}
      >
        <span style={{ textDecoration: 'underline dotted', fontWeight: 'bold' }}>Price:</span>
      </OverlayTrigger>
      &nbsp;
      {props.price}
    </div>
  );
}

class Business extends React.Component {
  state = {
    business: {},
    categories: [],
    authenticated: false,
    isBusinessOwner: false,
    user_id: '',
    images: [],
    reviews: []
  }

  componentDidMount() {
    this.getBusinessData()
    this.getReviews()

    checkIfAuthenticated()
      .then(res => {
        if (res.authenticated) {
          this.setState({ authenticated: true });
          this.setState({ user_id: res.user_id });
        }
      })
      .catch(err => {
        console.log(err)
        return
      })
  }

  getBusinessData = () => {
    getBusinessData(this.props.id)
      .then(res => {
        console.log(res.business);
        const business = res.business;
        this.setState({ business: business })
        this.setState({ images: business.images })
        if (business.userInfo.isOwner) {
          this.setState({ isBusinessOwner: true })
        }
        parseCategories(business.categories)
          .then(res => this.setState({ categories: res }))
        document.title = res.business.name;
      })
  }

  getReviews = () => {
    getReviews(this.props.id)
      .then(res => {
        if (res.status === 200) {
          // console.log(res.data);
          this.setState({ reviews: res.data.reviews })
        }
        else {
          console.log('error getting reviews')
          console.log(res)
        }
      })
  }

  uploadNewImage = (image, reviewId) => {
    console.log(`Business   uploadNewImage()   reviewId: ${reviewId}`);
    return new Promise((resolve, reject) => {
      resizeImage(image)
        .then(res => {
          let formData = new FormData();
          formData.append('image[image]', res)
          formData.append('image[user_id]', this.state.user_id)
          if (reviewId) {
            formData.append('image[review_id]', reviewId)
          }
          uploadPhoto(this.state.business.id, formData)
            .then(res => {
              if (res.status === 201) {
                this.updateImagesState(res.data.image)
                if (reviewId) {
                  this.addNewImageToNewReview(res.data.image, reviewId)
                }
              }
              resolve(res)
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }

  addNewImageToNewReview = (image, reviewId) => {
    // get reviews, find the review, add the new image, setState all reviews
    let reviews = this.state.reviews;
    let review = reviews.filter(review => { return review.id == reviewId })
    review = review[0];
    review.images.push(image);
    reviews.splice(0, 1, review);
    this.setState({ reviews: reviews });
  }

  handleInputChange = (e) => {
    this.setState({ image: e.target.files })
  }

  updateImageState = (updatedImage) => {
    let oldImages = this.state.images; // get the old images
    for (let i = 0; i < oldImages.length; i++) { // loop through old images
      let image = oldImages[i];
      if (image.id == updatedImage.id) { // if it's a match, replace the old image with updatedImage, then setState
        oldImages[i] = updatedImage;
        this.setState({ images: oldImages });
        break;
      }
    }
  }

  handleImageUpdate = (imageId, data) => {
    // build formdata to update image info(description & category), send to API & return as a promise
    let formData = new FormData();
    formData.append('image[description]', data.description);
    formData.append('image[category]', data.category);
    return new Promise((resolve, reject) => {
      updatePhotoDetails(imageId, formData)
        .then(res => {
          if (res.status === 200) {
            this.updateImageState(res.data.image);
            this.props.alert.show('image updated');
            resolve(res)
          } else {
            console.log(res)
            reject({ resolved: false })
          }
        })
    })
  }

  handleImageDelete = (photoId) => {
    // delete photo by API, then if response returns successful remove image from state
    return new Promise((resolve, reject) => {
      return deletePhoto(photoId)
        .then(res => {
          if (res.status === 200) {
            const newImages = this.state.images.filter((image) => {
              return Number(image.id) !== Number(photoId)
            })
            this.setState({ images: newImages });
            this.props.alert.success('image deleted');
            resolve(res)
          }
        })
        .catch(err => reject(err))
    })
  }

  updateImagesState = (image) => {
    // add new image to state
    let newImages = this.state.images;
    newImages.push(image);
    this.setState({ images: newImages })
  }

  updateReviewsState = (data) => {
    //  add new review to state
    let oldReviews = this.state.reviews;
    const newReview = data;
    let newReviews = oldReviews;
    newReviews.unshift(newReview);
    this.setState({ reviews: newReviews });
  }

  handleReviewSubmit = (data) => {
    return new Promise((resolve, reject) => {
      postReview(this.props.id, data)
        .then(res => {
          if (res.status === 201) {
            this.props.alert.show('Review posted!');
            this.updateReviewsState(res.data.review);
            resolve({ resolved: true, apiRes: res })
          } else {
            reject({ resolved: false })
            console.log(`postReview else`);
            console.log(res)
          }
        })
        .catch(err => {
          console.log(err);
        })
    })
  }

  removeImagesFromState = (images) => {
    // build array of image ids to remove, then filter this.state.images that don't match those ids
    let idsToRemove = [];
    images.forEach(image => idsToRemove.push(image.id));
    let filteredImages = this.state.images.filter(img => idsToRemove.indexOf(img.id) === -1);
    this.setState({ images: filteredImages });
  }

  handleReviewDelete = (reviewId) => {
    const review = this.state.reviews.filter(review => review.id == reviewId)[0];
    deleteReview(reviewId)
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Review deleted.')
          let reviews = this.state.reviews
          let newReviews = reviews.filter(review => {
            return review.id !== reviewId
          })
          this.setState({ reviews: newReviews })
          if (review.images.length > 0) {
            this.removeImagesFromState(review.images)
          }
        }
      })
  }

  updatePrimaryImage = (image) => {
    let formData = new FormData()
    formData.append('business[primary_photo_id]', image.id)
    return new Promise((resolve, reject) => {
      updateBusiness(this.state.business.id, formData)
        .then(res => {
          if (res.status === 200) {
            let updatedBiz = this.state.business
            updatedBiz.primaryPhoto = image
            this.setState({ business: updatedBiz })
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(err => {
          console.log(err);
          reject(err)
        })

    })
  }

  updateBusiness = (data) => {
    return new Promise((resolve, reject) => {
      updateBusiness(this.state.business.id, data)
        .then(res => {
          if (res.status === 200) {
            this.setState({ business: res.data.business })
            resolve(res);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  }

  render() {
    return (
      <div id="business">
        <h1>{this.state.business.name}</h1>
        <AvgRating reviewsSummary={this.state.business.reviewsSummary} />
        <PrimaryPhoto
          photo={this.state.business.primaryPhoto}
          images={this.state.images}
          bizName={this.state.business.name}
          bizId={this.state.business.id}
          authenticated={this.state.authenticated}
          user_id={this.state.user_id}
          updatePrimaryImage={this.updatePrimaryImage}
          isBusinessOwner={this.state.isBusinessOwner}
          handleImageUpdate={this.handleImageUpdate}
          handleImageDelete={this.handleImageDelete}
        />
        <EditBusinessBtn
          isBusinessOwner={this.state.isBusinessOwner}
          business={this.state.business}
          updateBusiness={this.updateBusiness}
        />
        <p>{this.state.business.address} {this.state.business.city}, {this.state.business.state}</p>
        <Categories categories={this.state.categories} />
        <p>{this.state.business.phone}</p>
        <p><a href={`http://${this.state.business.website}`} target="_blank">{this.state.business.website}</a></p>
        <br />
        <Price price={this.state.business.price} />
        <br />
        <About about={this.state.business.about} history={this.state.business.history} />
        <Hours hours={this.state.business.hours} />
        <br />
        <UploadPhotoBtn
          business={this.state.business}
          uploadNewImage={this.uploadNewImage}
          handleImageUpdate={this.handleImageUpdate}
          authenticated={this.state.authenticated}
        />
        <h1>Reviews</h1>
        <PostReviewBtn
          handleReviewSubmit={this.handleReviewSubmit}
          user_id={this.state.user_id}
          business_id={this.state.business.id}
          authenticated={this.state.authenticated}
          uploadNewImage={this.uploadNewImage}
          handleImageUpdate={this.handleImageUpdate}
        />
        <Reviews
          reviews={this.state.reviews}
          reviewsSummary={this.state.business.reviewsSummary}
          authenticated={this.state.authenticated}
          user_id={this.state.user_id}
          handleInputChange={this.handleInputChange}
          handleReviewDelete={this.handleReviewDelete}
        />
      </div>
    )
  }
}

export default withAlert()(Business)