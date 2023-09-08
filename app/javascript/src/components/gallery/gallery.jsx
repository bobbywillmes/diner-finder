import React, { Fragment, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Form } from 'react-bootstrap'
import './gallery.scss';
import { formatDateTime } from '../../helpers/utils';

function ImageButtons(props) {
  // if only one image
  if (props.imagesLength === 1 || !props) {
    return
  }
  // if first image
  else if (props.index === 0) {
    return (
      <Fragment>
        <div className="iconWrap left">
          <FontAwesomeIcon className="imageButton disabled" icon={['fas', 'circle-left']} />
        </div>
        <div className="iconWrap right">
          <FontAwesomeIcon className="imageButton" icon={['fas', 'circle-right']} onClick={props.nextImage} />
        </div>
      </Fragment>
    )
  }
  // if last image
  else if (props.index === props.imagesLength - 1) {
    return (
      <Fragment>
        <div className="iconWrap left">
          <FontAwesomeIcon className="imageButton" icon={['fas', 'circle-left']} onClick={props.previousImage} />
        </div>
        <div className="iconWrap right">
          <FontAwesomeIcon className="imageButton disabled" icon={['fas', 'circle-right']} />
        </div>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <div className="iconWrap left">
        <FontAwesomeIcon className="imageButton" icon={['fas', 'circle-left']} onClick={props.previousImage} />
      </div>
      <div className="iconWrap right">
        <FontAwesomeIcon className="imageButton" icon={['fas', 'circle-right']} onClick={props.nextImage} />
      </div>
    </Fragment>
  )
}

function UpdatedAlert(props) {
  const [show, setShow] = useState(true);
  if (props.updated) {
    setTimeout(() => {
      setShow(false)
    }, 2000)
  }
  if (props.updateNote) {
    return (
      <>
        <Alert show={show} variant="success" className="update-alert" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Message</Alert.Heading>
          <p>
            {props.updateNote}
          </p>
        </Alert>

      </>
    )
  }

  return (
    <>
      <Alert show={show} variant="success" className="update-alert" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Success!</Alert.Heading>
        <p>
          Photo details updated.
        </p>
      </Alert>

    </>
  )
}

function ImageEditor(props) {
  const [edit, setEdit] = useState(props.edit);
  const [inputField, setInputField] = useState({
    description: props.image.description,
    category: props.image.category
  });
  const [updated, setUpdated] = useState(false);
  const [updateNote, setUpdateNote] = useState(null);
  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value })
  }
  const toggleEdit = () => {
    setEdit(!edit)
  }
  const submitEdit = (e) => {
    e.preventDefault()
    let data = {
      description: inputField.description,
      category: inputField.category
    }
    props.imageHandleUpdate(data)
      .then(res => {
        if (res.status === 200) {
          setUpdated(true)
          setEdit(false)
          setTimeout(() => {
            setUpdated(false)
          }, 2000);
        }
      })
      .catch(err => console.log(err))
  }
  const setPrimaryImage = () => {
    props.setPrimaryImage()
      .then(res => {
        if (res.status === 200) {
          setUpdated(true);
          setUpdateNote('Image set as main image.')
          setTimeout(() => {
            setUpdated(false);
            setUpdateNote(null);
          }, 2000);
        }
      })
      .catch(err => console.log(err))
  }
  const deleteImage = (e) => {
    e.preventDefault();
    props.handleImageDelete(props.image.id)
      .then(res => {
        if (res.status === 200) {
          props.backToGallery();
        }
      })
      .catch(err => {
        if (err.response.status === 403) {
          setUpdateNote(err.response.data.message)
          setUpdated(true)
          setTimeout(() => {
            setUpdated(false);
            setUpdateNote(null);
          }, 2000);
        } else {
          console.log(err);
        }
      })
  }

  useEffect(() => {
    setInputField(props.image)
    setEdit(false)
  }, [props])

  return (
    <div id="imageEditor">
      <h2>ImageEditor</h2>
      <button className="btn btn-secondary" onClick={toggleEdit}>Edit Image</button>
      {edit ?
        <div>
          <Form onSubmit={submitEdit}>
            <Form.Group className="mb-3" controlId="imageEdit">
              <Form.Label>Image desciption</Form.Label>
              <Form.Control type="text" name="description" placeholder="Image description" value={inputField.description || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId={props.image.description} name="category" onChange={handleChange} value={inputField.category}>
              <Form.Check
                value="inside"
                type="radio"
                name="category"
                aria-label="inside"
                onChange={handleChange}
                checked={inputField.category === "inside"}
                label="Inside"
                id="inside"
              />
              <Form.Check
                value="outside"
                type="radio"
                name="category"
                aria-label="outside"
                onChange={handleChange}
                checked={inputField.category === "outside"}
                label="Outside"
                id="outside"
              />
              <Form.Check
                value="food"
                type="radio"
                name="category"
                aria-label="food"
                onChange={handleChange}
                checked={inputField.category === "food"}
                label="Food"
                id="food"
              />
              <Form.Check
                value="drink"
                type="radio"
                name="category"
                aria-label="drink"
                onChange={handleChange}
                checked={inputField.category === "drink"}
                label="Drink"
                id="drink"
              />
            </Form.Group>
            <button className="btn btn-primary">Submit</button>
          </Form>
          <br /><br />
          <button className="btn btn-info" onClick={setPrimaryImage}>Set as Main Image</button>
          <br />  <br />
          <button className="btn btn-danger" onClick={deleteImage}>Delete Image</button>
        </div>
        :
        <div>
        </div>
      }
      {updated ?
        <UpdatedAlert updated={updated} updateNote={updateNote} />
        :
        <div></div>
      }
    </div>
  )
}

function Image(props) {
  const [image, setImage] = useState(props.image);

  useEffect(() => {
    setImage(props.image)
  }, [props])

  const setPrimaryImage = () => {
    return new Promise((resolve, reject) => {
      props.updatePrimaryImage(image)
        .then(res => {
          resolve(res);
        })
    })
  }
  const imageHandleUpdate = (data) => {
    return new Promise((resolve, reject) => {
      props.imageUpdate(image.id, data)
        .then(res => {
          // console.log(res.data.image);
          // setImage(res.data.image)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  return (
    <div id="image" className="row">
      <div className="col-8 imageCol">
        <img src={image.url} alt="" />
        <ImageButtons
          index={props.index}
          imagesLength={props.imagesLength}
          nextImage={props.nextImage}
          previousImage={props.previousImage}
        />
      </div>
      <div className="col-4">
        <h4>{image.description}</h4>
        <p>by {image.userName} on {formatDateTime(image.date)}</p>
        <button className="btn btn-primary" onClick={props.backToGallery}>Back to gallery</button>
        <br /><br />
        <ImageEditor
          image={image}
          handleImageUpdate={props.handleImageUpdate}
          handleImageDelete={props.handleImageDelete}
          imageUpdate={props.imageUpdate}
          updateImageState={props.updateImageState}
          imageHandleUpdate={imageHandleUpdate}
          edit={props.edit}
          setPrimaryImage={setPrimaryImage}
          backToGallery={props.backToGallery}
        />
      </div>
    </div>
  )
}

function FilterButtons(props) {
  const [filter, setFilter] = useState(null);
  const handleOptionChange = (e) => {
    const option = e.target.value;
    props.setFilter(option);
    props.filterImagesState(option);
  }

  useEffect(() => {
    if (props) {
      setFilter(props.filter)
    }
  }, [props])

  const setClass = (type) => {
    if (props.categories) {
      let className = '';
      // disable button if not part of categories, else return selected if the filter === type, else return standard button
      if (props.categories.indexOf(type) == -1 && type !== 'all') {
        className = 'btn btn-primary disabled';
      } else if (filter === type) {
        className = 'btn btn-primary selected'
      } else {
        className = 'btn btn-primary'
      }
      return className
    }
  }

  return (
    <form id="filterButtons">

      <div className="form-check">
        <label className={setClass('all')}>
          <input
            type="radio"
            name="react-tips"
            value="all"
            checked={filter === "all"}
            onChange={handleOptionChange}
          />
          All
        </label>
      </div>

      <div className="form-check">
        <label className={setClass('food')}>
          <input
            type="radio"
            name="react-tips"
            value="food"
            checked={filter === "food"}
            onChange={handleOptionChange}
          />
          Food
        </label>
      </div>

      <div className="form-check">
        <label className={setClass('drink')}>
          <input
            type="radio"
            name="react-tips"
            value="drink"
            checked={filter === "drink"}
            onChange={handleOptionChange}
          />
          Drinks
        </label>
      </div>

      <div className="form-check">
        <label className={setClass('inside')}>
          <input
            type="radio"
            name="react-tips"
            value="inside"
            checked={filter === "inside"}
            onChange={handleOptionChange}
          />
          Inside
        </label>
      </div>

      <div className="form-check">
        <label className={setClass('outside')}>
          <input
            type="radio"
            name="react-tips"
            value="outside"
            checked={filter === "outside"}
            onChange={handleOptionChange}
          />
          Outside
        </label>
      </div>

    </form>
  )
}

function Thumbnail(props) {
  const [image, setImage] = useState(props.image)
  const clickImage = (e) => {
    props.setImageIndex(props.index)
  }

  return (
    <img
      src={image.url}
      alt={image.description}
      data-category={image.category}
      onClick={clickImage}
      className="thumbnail show"
    />
  )
}

function Thumbnails(props) {
  const [images, setImages] = useState(props.images);
  useEffect(() => {
    setImages(props.images);
  }, [props])
  return (
    images.map((image, index) => {
      return (
        <Thumbnail image={image} index={index} key={image.id} setImageIndex={props.setImageIndex} />
      )
    })
  )
}

function getCategories(images) {
  // get all unique image categories for filter buttons
  return new Promise((resolve, reject) => {
    let categories = [];
    images.forEach((image, index) => {
      const category = image.category;
      // if category doesn't yet exist and is not undefined or null
      if (categories.indexOf(category) == -1 && !(category == 'undefined') && !(category == null)) {
        categories.push(category);
      }
      // if the last iterion, return categories
      if (index == (images.length - 1)) {
        resolve(categories)
      }
    })
  })
}

function Gallery(props) {
  const [images, setImages] = useState(props.images)
  const [image, setImage] = useState(null)
  const [showImage, setShowImage] = useState(false)
  const [index, setIndex] = useState(null)
  const [categories, setCategories] = useState(null)
  const [filter, setFilter] = useState('all')
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    getCategories(images)
      .then(res => setCategories(res))
    setImages(props.images)
  }, [props])

  const setImageIndex = (index) => {
    setIndex(index)
    setImage(images[index])
    setShowImage(true)
  }
  const backToGallery = () => {
    setShowImage(false)
  }
  const nextImage = () => {
    setIndex(index + 1)
    setImage(images[index + 1])
    setEdit(false)
  }
  const previousImage = () => {
    setIndex(index - 1)
    setImage(images[index - 1])
    setEdit(false)
  }
  const updateImageState = (updatedImage) => {
    let oldImages = images;
    for (let i = 0; i < oldImages.length; i++) {
      let image = oldImages[i];
      if (image.id == updatedImage.id) {
        oldImages[i] = updatedImage
        setImages[oldImages]
        break;
      }
    }
  }

  const imageUpdate = (image, data) => {
    return new Promise((resolve, reject) => {
      props.handleImageUpdate(image, data)
        .then(res => {
          if (res.status === 200) {
            updateImageState(res.data.image)
            resolve(res)
          }
        })
        .catch(err => {
          console.log(err)
          reject(res)
        })
    })
  }

  function filterImagesState(option) {
    setFilter(option);
    const images = props.images;
    if (option === 'all') {
      setImages(images);
      return
    }
    let filteredImages = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (image.category === option) {
        filteredImages.push(image);
      }
    }
    setImages(filteredImages);
  }

  return (
    <div id="gallery">
      {showImage ?
        <Image
          image={image}
          imagesLength={images.length}
          index={index}
          bizId={props.bizId}
          backToGallery={backToGallery}
          nextImage={nextImage}
          previousImage={previousImage}
          updatePrimaryImage={props.updatePrimaryImage}
          handleImageUpdate={props.handleImageUpdate}
          handleImageDelete={props.handleImageDelete}
          imageUpdate={imageUpdate}
          edit={edit}
        />
        :
        <div>
          <FilterButtons
            images={images}
            categories={categories}
            filterImagesState={filterImagesState}
            filter={filter}
            setFilter={setFilter}
          />
          <Thumbnails
            images={images}
            setImage={setImage}
            setImageIndex={setImageIndex}
          />
        </div>
      }
    </div>
  )
}

export default Gallery;