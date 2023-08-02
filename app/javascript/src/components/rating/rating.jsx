import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './rating.scss'

function Stars(props) {
  let html = []
  let starValue = props.stars
  // for loop to build five stars
  for (let i = 1; i < 6; i++) {
    let icon = undefined
    // build a fully filled star
    if (i < props.stars) {
      icon = <span key={i} className="star">
        <FontAwesomeIcon icon={['fas', 'star']} />
      </span>
      html.push(icon)
      starValue = starValue - 1
      continue
    }
    // build a partially filled star
    if (starValue > 0) {
      let leftVal = Math.round(starValue * 100)
      icon = <span key={i} className="star" style={{ backgroundImage: `linear-gradient(to right, red, red ${leftVal}%, white ${leftVal}%, #ddd)` }} >
        <FontAwesomeIcon icon={['fas', 'star']} />
      </span>
      html.push(icon)
      starValue = starValue - starValue
      continue
    }
    // build an empty star
    else {
      icon = <span key={i} className="star empty">
        <FontAwesomeIcon icon={['fas', 'star']} />
      </span>
    }
    html.push(icon)
  }
  return html
}

function AvgRating(props) {
  //  wait for props
  if (!props.reviewsSummary) {
    return
  }
  let ratingText = ''
  if (props.reviewsSummary.count === 0) {
    ratingText = 'No reviews yet.'
  } else {
    ratingText = <span>
      Avg rating: {props.reviewsSummary.avg} ({props.reviewsSummary.count}  reviews)
    </span>
  }
  return (
    <div className="ratingSummary">
      <Stars stars={props.reviewsSummary.avg} count={props.reviewsSummary.count} />
      &nbsp;
      {ratingText}
    </div>
  )
}

function ReviewStars(props) {
  //  wait for props
  if (!props.rating) {
    return
  }
  return (
    <div className="reviewStars">
      <Stars stars={props.rating} />
    </div>
  )
}

export { AvgRating, ReviewStars }