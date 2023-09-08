import React from 'react';
import { Categories } from '../../helpers/utils'
import { AvgRating } from '../rating/rating'

function Business(props) {
  return (
    <div className="business row">
      <div className="imgWrap col-3">
        <img src={props.business.primaryPhoto.url} alt="" />
      </div>
      <div className="col-9">
        <h2><a href={`/biz/${props.business.id}`}>{props.business.name}</a></h2>
        <h5>{props.business.city}, {props.business.state}</h5>
        <Categories categories={props.business.categories} />
        <AvgRating reviewsSummary={props.business.reviewsSummary} />
      </div>
    </div>
  )
}

function Businesses(props) {
  if (props.businesses.length === 0) {
    return (
      <div>Sorry, nothing found :(</div>
    )
  }
  return (
    <div id="businesses">
      {props.businesses.map(business => {
        return (
          <Business key={business.id} business={business} />
        )
      })}
    </div>
  )
}

export default Businesses