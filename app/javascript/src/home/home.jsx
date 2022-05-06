import React from 'react';

class Home extends React.Component {
  state = {
    bizName: 'Diner Finder'
  }

  render() {
    return (
      <div id="home">
        <h1>{this.state.bizName}</h1>
      </div>
    )
  }
}

export default Home