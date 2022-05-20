import React from 'react';
import { Fragment } from 'react';
import { apiLogout, apiUserDetails } from '../../api/user';

class Account extends React.Component {
  state = {
    user: {}
  }

  componentDidMount() {
    apiUserDetails(this.props.userId)
      .then(res => {
        this.setState({ user: res.data.user });
      })
  }

  logout = () => {
    apiLogout()
      .then(res => {
        console.log(res);
        if (res.data.success) {
          window.location = '/login'
        }
      })
  }

  render() {
    return (
      <Fragment>
        <h2>Account</h2>
        <h3>Welcome {this.state.user.name || ''}</h3>
        <h4>Location: {this.state.user.location || ''}</h4>
        <br /><br /><br />
        <button className="btn btn-danger" onClick={this.logout}>Logout</button>
      </Fragment>
    )
  }

}

export default Account