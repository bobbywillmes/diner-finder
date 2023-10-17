import React from 'react';
import { useState, useEffect } from 'react';
import './searchBox.scss';

function Location(props) {
  if (!props.value) { return }
  const clickItem = (e) => {
    props.handleClick(props.value);
  }
  return (
    <div onClick={clickItem} className={props.currentFocus == (props.index + 1) ? 'autocomplete-active' : ''}>{props.value}</div>
  )
}

function Locations(props) {
  if (!props.locations || !props.showLocations) { return }
  return (
    <div id="autocomplete-list" className="autocomplete-items" onMouseOver={props.handleHover}>
      {props.locations.map((value, index) => {
        return <Location
          key={index}
          index={index}
          handleClick={props.handleClick}
          value={value}
          currentFocus={props.currentFocus}
        />
      })}
    </div>
  )
}

function SearchBox(props) {
  if (!props.locations) { return }
  const [query, setQuery] = useState('');
  const [initialLocations, setInitialLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [currentFocus, setCurrentFocus] = useState(0);
  const [showLocations, setShowLocations] = useState(false);

  useEffect(() => {
    if (props.locations) {
      setInitialLocations(props.locations)
    }
    if (props.location) {
      setLocation(props.location)
    }
  }, [props])

  useEffect(() => {
    setSearchQuery()
  }, [])

  const increaseFocus = () => {
    if (currentFocus == locations.length) {
      setCurrentFocus(0)
    } else {
      setCurrentFocus(currentFocus + 1);
    }

  }

  const decreaseFocus = () => {
    if (currentFocus == 0) {
      setCurrentFocus(locations.length)
    } else {
      setCurrentFocus(currentFocus - 1);
    }
  }

  const filterLocations = (val) => {
    let newValues = initialLocations.filter(value => value.toLowerCase().indexOf(val.toLowerCase()) != -1);
    if (val == '') {
      newValues = [];
    }
    setLocations(newValues)
  }

  const handleQueryInput = (e) => {
    setQuery(e.target.value)
  }

  const handleLocationInput = (e) => {
    setLocation(e.target.value)
    filterLocations(e.target.value);
    setCurrentFocus(0);
  }

  const handleKeyDown = (e) => {
    setShowLocations(true)
    if (e.keyCode == 40) {
      increaseFocus()   // down arrow
    } else if (e.keyCode == 38) {
      decreaseFocus()   // up arrow
    } else if (e.keyCode == 13) {
      e.preventDefault()  // enter
      if (currentFocus == 0) {
        // location is already set, submit the search
        return handleSubmit(e)
      }
      // set the location for the selected item
      setLocation(locations[currentFocus - 1])
      setLocations([])
      setCurrentFocus(0)
    }
  }

  const handleClick = (val) => {
    setLocation(val);
    setLocations([])
  }

  const handleFocus = () => {
    setShowLocations(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setShowLocations(false)
    }, 100);
  }

  const getSearchQuery = () => {
    const params = new URLSearchParams(window.location.search);
    let keyword = null;
    let location = null;
    return new Promise((resolve, reject) => {
      for (var [key, value] of params.entries()) {
        if (key == 'keyword') {
          keyword = value
        }
        if (key == 'location') {
          location = value
        }
      }
      resolve({
        keyword: keyword,
        location: location
      })
    })
  }

  const setSearchQuery = () => {
    if (window.location.href.indexOf('search') != -1) {
      getSearchQuery()
        .then(res => {
          setQuery(res.keyword)
          setLocation(res.location)
        })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location = `/search?keyword=${query}&location=${location}`
  }

  const handleHover = () => {
    setCurrentFocus(0)
  }

  return (
    <div className="searchWrap">
      <form onSubmit={handleSubmit}>
        <input id="query" type="text" placeholder="bars, sandwiches, Peg's" onInput={handleQueryInput} value={query} />
        <div id="location" className="autocomplete">
          <input type="text" name="location" placeholder="location" value={location} onInput={handleLocationInput} onKeyDown={handleKeyDown} onBlur={handleBlur} onFocus={handleFocus} autoComplete="off" />
          <Locations locations={locations} currentFocus={currentFocus} handleClick={handleClick} showLocations={showLocations} handleHover={handleHover} />
        </div>
        <input id="submitBtn" type="submit" />
      </form>
    </div>
  )
}

export default SearchBox
