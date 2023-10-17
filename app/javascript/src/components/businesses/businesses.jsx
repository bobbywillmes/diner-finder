import React from 'react';
import { Categories } from '../../helpers/utils';
import { AvgRating } from '../rating/rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './businesses.scss';

function Business(props) {
  return (
    <div className="business row" key={props.business.id}>
      <div className="col-12 col-md-3 imgWrap">
        <img src={props.business.primaryPhoto.src} alt="" />
      </div>
      <div className="col-12 col-md-9">
        <h2><a href={`/biz/${props.business.id}`}>{props.business.name}</a></h2>
        <h5>{props.business.city}, {props.business.state}</h5>
        <Categories categories={props.business.categories} />
        <AvgRating reviewsSummary={props.business.reviewsSummary} />
        <div className="count">{props.count}</div>
      </div>
    </div>
  )
}

function Businesses(props) {
  if (!props.businesses) { return }
  if (props.businesses.length === 0) {
    return (
      <div id="noResults">
        <h4>Sorry, nothing found</h4>
        <FontAwesomeIcon icon={['fas', 'face-frown']} className="h4" />
      </div>
    )
  }
  const startCount = (props.page - 1) * 10;
  return (
    <div id="businesses">
      {props.businesses.map((business, index) => {
        return (
          <React.Fragment key={business.id}>
            <Business business={business} index={index} count={startCount + index + 1} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Businesses