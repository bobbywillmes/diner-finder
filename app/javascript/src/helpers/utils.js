import React from "react";

export function Categories(props) {
  let str = '';
  let splitter = '';
  return (
    props.categories.map((category, index) => {
      if(index > 0) { splitter = ', '}
      str = <a href={`/search?q=${category}`}>{splitter} {category}</a>
      return (
        <span key={index}>{str}</span>
      )
    })
  )
}