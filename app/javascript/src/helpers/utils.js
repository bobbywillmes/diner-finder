import React from "react";
import Resizer from "react-image-file-resizer";

export function parseCategories(text) {
  return new Promise((resolve, reject) => {
    const arr = JSON.parse(text);
    resolve(arr);
  })
}

export function Categories(props) {
  let splitter = '';
  return (
    <div className="categories">
      {props.categories.map((category, index) => {
        if (index > 0) { splitter = ', ' }
        return (
          <React.Fragment key={index}>
            {splitter}<a href={`/search?keyword=${category}`}>{category}</a>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export function resizeImage(img) {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      img,
      2000, // max-width
      2000, // max-height
      "JPEG",  // file type
      50,  // quality
      0, // rotation
      (uri) => {
        resolve(uri);
      },
      "file" // output type
    );
  })
}

export function formatDateTime(date) {
  let newDate = new Date(
    new Date(date).getFullYear(),
    new Date(date).getMonth(),
    new Date(date).getDate(),
    new Date(date).getHours(),
    new Date(date).getMinutes(),
    new Date(date).getSeconds()
  );
  const options = {
    dateStyle: 'full',
    // timeStyle: 'short'
  }
  newDate = newDate.toLocaleString('en-us', options);
  return newDate
}