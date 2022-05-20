import React from 'react';
import { Fragment } from 'react';
import { apiSignup, apiLogin } from '../../api/user';

class Signup extends React.Component {
  state = {
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    location: ''
  }

  clearErrors = () => {
    console.log(`clearErrors()`)
    let errors = document.getElementsByClassName('invalid-feedback');
    console.log(errors);
    let errArr = [...errors];
    errArr.forEach(error => {
      error.innerHTML = '';
    })
  }

  signup = (e) => {
    console.log(`signup()`);
    e.preventDefault();
    let formData = new FormData();
    formData.append('user[email]', this.state.email);
    formData.append('user[password]', this.state.password);
    formData.append('user[name]', this.state.name);
    formData.append('user[location]', this.state.location);
    apiSignup(formData)
      .then(res => {
        console.log(res);
        if (res.status === 201) {
          console.log(`successsully signed up`);
          apiLogin(formData)
            .then(res => {
              console.log(res);
              if (res.data.success) {
                window.location = '/account'
              }
            })
        } else if (res.data.success == false) {
          console.log(`res.data.success == false`);
          console.log(res.data.error);
          let errors = [];
          this.clearErrors();
          Object.entries(res.data.error).forEach(([key, value]) => {
            let errorMsg = key + ' ' + value;
            console.log(errorMsg);
            let el = document.querySelector(`#${key}Validation`);
            el.classList.add('show');
            el.innerHTML = errorMsg;
            errors.push(key);
          })
          console.log(errors);
        }
      })
  }

  enableSignup = () => {
    const submitBtn = document.querySelector('#submit');
    submitBtn.setAttribute('disabled', true);
    if (this.state.email == '' || this.state.password == '' || this.state.passwordConfirm == '' || this.state.name == '' || this.state.location == '') {
      return false
    }
    if (this.state.password !== this.state.passwordConfirm || this.state.password.length < 8) {
      return false
    }
    submitBtn.removeAttribute('disabled');
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidUpdate() {
    this.enableSignup();
  }

  // form inputs are readonly by default to prevent autofill, onFocus enables them
  enableInput = (e) => {
    e.target.removeAttribute('readonly')
  }

  render() {
    const { email, password, passwordConfirm, name, location, error } = this.state
    return (
      <Fragment>
        <h2>Signup</h2>
        <form id="signup" onSubmit={this.signup}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email address</label>
            <input readOnly onFocus={this.enableInput} type="email" name="email" className="form-control" id="emailInput" aria-describedby="emailHelp" value={email} onChange={this.handleChange} />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            <div id="emailValidation" className="invalid-feedback"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">Password</label>
            <input readOnly onFocus={this.enableInput} type="password" name="password" className="form-control" id="passwordInput" aria-describedby="passwordHelp" value={password} onChange={this.handleChange} />
            <div id="passwordHelp" className="form-text">At least 8 characters.</div>
            <div id="passwordValidation" className="invalid-feedback"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordConfirmInput" className="form-label">Password Confirm</label>
            <input readOnly onFocus={this.enableInput} type="password" name="passwordConfirm" className="form-control" id="passwordConfirmInput" aria-describedby="passwordConfirmHelp" value={passwordConfirm} onChange={this.handleChange} />
            <div id="passwordConfirmHelp" className="form-text">Please confirm your password.</div>
            <div id="passwordValidation" className="invalid-feedback"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input readOnly onFocus={this.enableInput} type="text" name="name" className="form-control" id="name" aria-describedby="nameHelp" onChange={this.handleChange} />
            <div id="nameHelp" className="form-text">Your profile name, public on Diner Finder.</div>
            <div id="nameValidation" className="invalid-feedback"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input readOnly onFocus={this.enableInput} type="text" name="location" className="form-control" id="location" aria-describedby="locationHelp" onChange={this.handleChange} />
            <div id="locationHelp" className="form-text">Where you are currently living.</div>
            <div id="locationValidation" className="invalid-feedback"></div>
          </div>
          <button disabled id="submit" type="submit" className="btn btn-primary">Submit</button>
        </form>
      </Fragment>
    )
  }
}

export default Signup