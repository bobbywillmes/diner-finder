import React from 'react';
import { Fragment } from 'react';
import { apiLogin } from '../../api/user';
import { withAlert } from 'react-alert';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  }

  login = (e) => {
    console.log(`login()`);
    e.preventDefault();
    let formData = new FormData()
    formData.append('user[email]', this.state.email)
    formData.append('user[password]', this.state.password)
    apiLogin(formData)
      .then(res => {
        if (res.data.success) {
          window.location = '/account'
        } else if (res.data.success == false) {
          console.log(`res.data.success == false`);
          this.props.alert.show('incorrect credentials');
        }
      })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { email, password, error } = this.state
    return (
      <Fragment>
        <h2>Login</h2>
        <form onSubmit={this.login}>
          <input name="email" type="text" className="form-control form-control-lg mb-3" placeholder="Email" value={email} onChange={this.handleChange} required />
          <input name="password" type="password" className="form-control form-control-lg mb-3" placeholder="Password" value={password} onChange={this.handleChange} required />
          <button type="submit" className="btn btn-danger btn-block btn-lg">Log in</button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </form>
      </Fragment>
    )
  }
}

export default withAlert()(Login)