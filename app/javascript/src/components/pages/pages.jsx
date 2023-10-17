import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './pages.scss';

function getParams() {
  return new Promise((resolve, reject) => {
    let url = window.location.search;
    if (url.indexOf('page=') != -1) {
      url = url.substring(0, url.indexOf('page=') - 1);
    }
    resolve(url)  // return url search params without page=
  })
}

function Pages(props) {
  if (props.total_pages <= 1) { return }
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    getParams()
      .then(res => {
        buildBaseUrl(res)
      })
  }, [])

  const buildBaseUrl = (url) => {
    let newUrl = '';
    // check if url already has search params (keyword & location)
    if (url.indexOf('?') > -1) {
      newUrl = url + '&page=';
    } else {
      newUrl = '?page=';
    }
    setBaseUrl(newUrl);
  }

  const PreviousBtn = (props) => {
    const previous = props.current_page - 1;
    if (props.current_page == 1) {
      return (
        <Button variant="outline-primary" disabled>
          <FontAwesomeIcon icon={['fas', 'arrow-left']} className="arrow" />
        </Button>
      )
    }
    return (
      <Button variant="outline-primary" href={baseUrl + previous}>
        <FontAwesomeIcon icon={['fas', 'arrow-left']} className="arrow" />
      </Button>
    )
  }

  const NextBtn = (props) => {
    const next = props.current_page + 1;
    if (props.current_page == props.total_pages) {
      return (
        <Button variant="outline-primary" disabled>
          <FontAwesomeIcon icon={['fas', 'arrow-right']} />
        </Button>
      )
    }
    return (
      <Button variant="outline-primary" href={baseUrl + next}>
        <FontAwesomeIcon icon={['fas', 'arrow-right']} />
      </Button>
    )
  }

  const PageNum = (props) => {
    if (props.current_page == props.page) {
      return (
        <span>{props.page}</span>
      )
    }
    return (
      <a href={baseUrl + props.page} className="pageNum">{props.page}</a>
    )
  }

  // if more than 10 pages, only show the current 9, with current in the center
  let total_pages = props.total_pages;
  let current_page = props.current_page;
  let min = 1;
  let max = 9;

  // keep the current_page in the 'center'
  if (current_page > 5) {
    min = current_page - 4;
    max = current_page + 4;
  }

  // if getting to the end (the last 4), just show the last 9, losing the 'center' focus
  if (current_page >= (total_pages - 4)) {
    max = total_pages;
    min = max - 8;
  }

  // if less than 9 total_pages, always show 1 to max
  if (total_pages < 9) {
    min = 1;
    max = total_pages;
  }

  return (
    <div id="pages">
      <PreviousBtn current_page={props.current_page} />
      {(() => {
        let pages = [];
        for (let i = min; i <= max; i++) {
          pages.push(<PageNum key={i} page={i} current_page={props.current_page} />)
        }
        return pages
      })()}
      <NextBtn current_page={props.current_page} total_pages={props.total_pages} />
      <br />
      <div>({props.current_page} of {props.total_pages} )</div>
    </div>
  )
}

export default Pages