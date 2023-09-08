import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './editor.scss';

function SuccessAlert(props) {
  const [show, setShow] = useState(true);

  if (props.updated) {
    setTimeout(() => {
      setShow(false)
    }, 2000)
  }

  return (
    <>
      <Alert show={show} variant="success" className="update-alert" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Success!</Alert.Heading>
        <p>
          Business details updated.
        </p>
      </Alert>
    </>
  )
}

function Editor(props) {
  const [inputFields, setInputFields] = useState({
    name: props.business.name,
    address: props.business.address,
    city: props.business.city,
    state: props.business.state
  });
  const [updated, setUpdated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateBusiness(inputFields)
      .then(res => {
        if (res.status === 200) {
          setUpdated(true);
          setTimeout(() => {
            setUpdated(false)
          }, 2000);
        }
      })
      .catch(err => console.log(err))
  }

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value })
  }

  return (
    <div id="editor">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Business name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Business name" value={inputFields.name} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" placeholder="Address" value={inputFields.address} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" name="city" placeholder="city" value={inputFields.city} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="state">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" name="state" placeholder="state" value={inputFields.state} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <br />
      <p>Note: the main image for this business can be set in the photo gallery.</p>

      {updated &&
        <SuccessAlert updated={updated} />
      }

    </div>
  )
}

export default Editor