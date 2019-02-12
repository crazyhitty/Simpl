import React from 'react';
import ReactDom from 'react-dom';
import Hello from './Hello';

class Dummy extends React.Component {
  render() {
    return (
      <div>
        <p>Pls work</p>
        <Hello />
      </div>
    )
  }
}

ReactDom.render(<Dummy/>, document.getElementById('app'));