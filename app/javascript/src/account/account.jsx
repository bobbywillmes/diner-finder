import React from 'react';
import { Fragment } from 'react';
import { apiLogout, apiUserDetails } from '../../api/user';
import { formatDateTime } from '../helpers/utils';
import { ReviewStars } from '../components/rating/rating';

function Images(props) {
  if (!props || props.images.length === 0) { return }
  return (
    <div id="images">
      <h4>My Images (not part of a review)</h4>
      <div className="container">
        {props.images.map(image => {
          return (
            <div key={image.id} className="row">
              <div className="col-12 col-md-5 imageWrap">
                <img src={image.src} alt={image.description} />
              </div>
              <div className="col-12 col-md-7">
                <h6><a href={`/biz/${image.business_id}`}>{image.businessName}</a></h6>
                <p>{formatDateTime(image.date)}</p>
                <p>{image.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Reviews(props) {
  if (!props || props.reviews.length === 0) { return }
  return (
    <div id="reviews">
      <h4>My Reviews</h4>
      {props.reviews.map(review => {
        return (
          <div key={review.id}>
            <h5><a href={`/biz/${review.business_id}`}>{review.businessName}</a></h5>
            <span>{formatDateTime(new Date(review.date))}</span>
            <ReviewStars rating={review.rating} />
            <p>{review.text}</p>
            <div className="images">
              {review.images.map(image => {
                return (
                  <img key={image.id} src={image.src} alt="" />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Stats(props) {
  if (!props) { return }
  return (
    <div id="stats">
      <h4>My Stats</h4>
      <p><strong>Member since: </strong>{props.joinDate}</p>
      <p><strong>Images uploaded: </strong>{props.imageCount}</p>
      <p><strong>Reviews posted: </strong>{props.reviewCount}</p>
    </div>
  )
}

class Account extends React.Component {
  state = {
    user: {},
    reviews: [],
    images: [],
    imageCount: null,
    reviewCount: null,
    joinDate: ''
  }

  componentDidMount() {
    apiUserDetails(this.props.userId)
      .then(res => {
        console.log(res.data);
        this.setState({ user: res.data.user });
        this.setState({ reviews: res.data.user.reviews });
        this.setState({ images: res.data.user.images });
        this.setState({ imageCount: res.data.user.imageCount });
        this.setState({ reviewCount: res.data.user.reviewCount });
        this.setState({ joinDate: formatDateTime(res.data.user.join_date) });
      })
    document.title = 'DinerFinder - My Account'
  }

  logout = () => {
    apiLogout()
      .then(res => {
        console.log(res);
        if (res.data.success) {
          window.location = '/login'
        }
      })
  }

  render() {
    return (
      <Fragment>
        <h2>Account</h2>
        <h3>Welcome {this.state.user.name || ''}</h3>
        <h4>Location: {this.state.user.location || ''}</h4>
        <br /><br />
        <button className="btn btn-danger" onClick={this.logout}>Logout</button>
        <br /><br />
        <Stats imageCount={this.state.imageCount} reviewCount={this.state.reviewCount} joinDate={this.state.joinDate} />
        <Images images={this.state.images} />
        <Reviews reviews={this.state.reviews} />
      </Fragment>
    )
  }

}

export default Account