import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DrawCanvas, { LINE } from './DrawCanvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
          <DrawCanvas 
            imgSrc="https://ric-bucket.s3.amazonaws.com/device_5c05ee0cb669e165879e622a/sensorview.jpg"
            height="240"
            width="300"
            tool={LINE}
            onCompleteDraw={(data) => console.log(data)}
          />
      </div>
    );
  }
}

export default App;
