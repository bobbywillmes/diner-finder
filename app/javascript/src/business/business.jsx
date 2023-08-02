import React from 'react';
import { useState } from 'react';
import { getBusiness, uploadPhoto, deletePhoto, updatePhotoDetails, postReview, getReviews, deleteReview } from '../../api/business';
import NewReview from '../components/reviews/newReview';
import { AvgRating } from '../components/rating/rating';
import { Reviews } from '../components/reviews/reviews';
import { apiAuthenticated } from '../../api/user';
import { Categories, parseCategories, resizeImage } from '../helpers/utils';
import { withAlert } from 'react-alert';
import { Button, Modal } from 'react-bootstrap';

class ImageUpload extends React.Component {
  state = {
    image: undefined,
    resizedImages: undefined
  }

  render() {
    if (this.props.authenticated) {
      return (
        <div id="upload">
          <h4>Upload a photo</h4>
          <form onSubmit={this.props.handleUpload}>
            <input type="file" name="image" onChange={this.props.handleInputChange} />
            <br />
            <button className="btn btn-secondary">Upload</button>
          </form>
        </div>
      )
    }
    else {
      return (
        <a href="/login" className="btn btn-info">Login to upload an image.</a>
      )
    }
  }
}

class ImageEdit extends React.Component {
  state = {
    description: '',
    category: undefined
  }

  componentDidMount() {
    this.setState({ description: this.props.description })
    this.preSelectCategory()
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  preSelectCategory() {
    const category = this.props.category;
    const options = document.querySelector('#category').children;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value == category) {
        options[i].selected = true;
      }
    }
  }

  handleImageDelete = (e) => {
    const photoId = e.target.parentNode.parentNode.parentNode.getAttribute('id');
    this.props.handleImageDelete(photoId)
  }

  handleImageUpdate = (e) => {
    e.preventDefault()
    this.props.handleImageUpdate(this.props.id, this.state.description, this.state.category)
      .then(res => {
        this.props.toggleEdit()
      })
  }

  render() {
    return (
      <div id="edit">
        <h2>Edit Image Info..</h2>
        <button className="btn btn-secondary" onClick={this.props.toggleEdit}>Cancel Edit</button>
        <form onSubmit={this.handleImageUpdate}>
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
        <button className="btn btn-warning" onClick={this.handleImageDelete}>Delete Image</button>
      </div>
    )
  }
}

class ImageView extends React.Component {
  state = {
    authorizedToEdit: false
  }

  componentDidMount() {
    if (this.props.image.user_id === this.props.user_id) {
      this.setState({ authorizedToEdit: true })
    }
  }

  render() {
    return (
      <div id="view">
        <h2>View Image info</h2>
        <strong>Description: </strong> <span>{this.props.image.description}</span>
        <br />
        <strong>Category: </strong> <span>{this.props.image.category}</span>
        <br />
        <strong>User: </strong> <span>{this.props.image.userName} from {this.props.image.userLocation}</span>
        <br /><br />
        {this.state.authorizedToEdit ? <button className="btn btn-primary" onClick={this.props.toggleEdit}>Edit Info</button> : ''}
      </div>
    )
  }
}

class Image extends React.Component {
  state = {
    edit: false
  }

  toggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  render() {
    return (
      <div id={this.props.image.id} key={this.props.image.id} className="row image">
        <div className="col">
          <img src={this.props.image.url} alt="" />
        </div>
        <div className="col">
          {this.state.edit ?
            <ImageEdit
              toggleEdit={this.toggleEdit}
              id={this.props.image.id}
              description={this.props.image.description}
              category={this.props.image.category}
              handleImageUpdate={this.props.handleImageUpdate}
              handleImageDelete={this.props.handleImageDelete}
            /> :
            <ImageView
              image={this.props.image}
              toggleEdit={this.toggleEdit}
              authenticated={this.props.authenticated}
              user_id={this.props.user_id}
            />}
        </div>
      </div>
    )
  }
}

class Images extends React.Component {
  render() {
    return (
      <div className="container">
        <h3>Images</h3>
        {this.props.images.map(image => {
          return (
            <Image image={image} key={image.id} authenticated={this.props.authenticated} user_id={this.props.user_id} handleImageUpdate={this.props.handleImageUpdate} handleImageDelete={this.props.handleImageDelete} />
          )
        })}
      </div>
    )
  }
}

function PostReviewBtn(props) {
  // button to show modal with NewReview component
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
}

class Business extends React.Component {
  state = {
    business: {},
    categories: [],
    authenticated: false,
    user_id: '',
    images: [],
    reviews: []
  }

  componentDidMount() {
    getBusiness(this.props.id)
      .then(res => {
        if (res.status === 200) {
          this.setState({ business: res.data.business })
          this.setState({ images: res.data.business.images })
          parseCategories(res.data.business.categories)
            .then(res => this.setState({ categories: res }))
        }
      })
    getReviews(this.props.id)
      .then(res => {
        if (res.status === 200) {
          this.setState({ reviews: res.data.reviews })
        }
        else {
          console.log('error getting reviews')
          console.log(res)
        }
      })
    apiAuthenticated()
      .then(res => {
        if (res.data.authenticated) {
          this.setState({ authenticated: true });
          this.setState({ user_id: res.data.user_id });
        }
      })
  }

  handleUpload = (e) => {
    e.preventDefault();
    const resizedImages = []
    let formData = new FormData();
    resizeImage(this.state.image[0])
      .then(res => {
        resizedImages.push(res);
        this.setState({ resizedImages: resizedImages });
        formData.append('image[image]', res);
        formData.append('image[user_id]', this.state.user_id);
        uploadPhoto(this.state.business.id, formData)
          .then(res => {
            if (res.status === 201) {
              let oldImages = this.state.images
              oldImages.push(res.data.image)
              this.setState({ images: oldImages })
              this.props.alert.success('image uploaded');
            }
          })
          .catch(err => console.log(err))
      })
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

  handleImageUpdate = (imageId, description, category) => {
    // build formdata to update image info(description & category), send to API & return as a promise
    let formData = new FormData();
    formData.append('image[description]', description);
    formData.append('image[category]', category);
    return new Promise((resolve, reject) => {
      updatePhotoDetails(imageId, formData)
        .then(res => {
          if (res.status === 200) {
            this.updateImageState(res.data.image);
            this.props.alert.show('image updated');
            resolve({ resolved: true })
          } else {
            reject({ resolved: false })
          }
        })
    })
  }

  handleImageDelete = (photoId) => {
    // delete photo by API, then if response returns successful remove image from state
    deletePhoto(photoId)
      .then(res => {
        if (res.status === 200) {
          const newImages = this.state.images.filter((image) => {
            return Number(image.id) !== Number(photoId)
          })
          this.setState({ images: newImages });
          this.props.alert.success('image deleted');
        }
      })
      .catch(err => {
        console.log(err);
      })
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

  handleReviewDelete = (reviewId) => {
    deleteReview(reviewId)
      .then(res => {
        if (res.status === 200) {
          this.props.alert.success('Review deleted.')
          let reviews = this.state.reviews
          let newReviews = reviews.filter(review => {
            return review.id !== reviewId
          })
          this.setState({ reviews: newReviews })
        }
      })
  }

  render() {
    return (
      <div id="business">
        <h1>{this.state.business.name}</h1>
        <AvgRating reviewsSummary={this.state.business.reviewsSummary} />
        <p>{this.state.business.address} {this.state.business.city}, {this.state.business.state}</p>
        <Categories categories={this.state.categories} />
        <p>{this.state.business.phone}</p>
        <p><a href={this.state.business.website} target="_blank">{this.state.business.website}</a></p>
        <ImageUpload
          authenticated={this.state.authenticated}
          user_id={this.state.user_id}
          business_id={this.state.business.id}
          handleUpload={this.handleUpload}
          handleInputChange={this.handleInputChange} />
        <br />
        <h1>Reviews</h1>
        <PostReviewBtn
          handleReviewSubmit={this.handleReviewSubmit}
          user_id={this.state.user_id}
          business_id={this.state.business.id} />
        <Reviews
          reviews={this.state.reviews}
          reviewsSummary={this.state.business.reviewsSummary}
          authenticated={this.state.authenticated}
          user_id={this.state.user_id}
          handleUpload={this.handleUpload}
          handleInputChange={this.handleInputChange}
          handleReviewDelete={this.handleReviewDelete} />
        <Images
          images={this.state.images}
          authenticated={this.state.authenticated}
          user_id={this.state.user_id}
          handleImageDelete={this.handleImageDelete}
          handleImageUpdate={this.handleImageUpdate} />
      </div>
    )
  }
}

export default withAlert()(Business)