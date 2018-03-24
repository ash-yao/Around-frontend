import React, { Component } from 'react';
import { Header } from './Header';
import { Main } from './Main';
import{TOKEN_KEY} from "../constants"
import '../styles/App.css';

class App extends Component {
  state = {
    isLogedIn : Boolean(localStorage.getItem(TOKEN_KEY))
  }
  handleLogOut = ()=>{
    localStorage.removeItem(TOKEN_KEY);
    this.setState({isLogedIn: false});
  }
  handleLogIn = (response)=>{
    localStorage.setItem(TOKEN_KEY, response);
    this.setState({isLogedIn: true});
  }
  render() {
    return (
      <div className="App">
        <Header isLogedIn={this.state.isLogedIn} handleLogOut={this.handleLogOut}/>
          <Main isLogedIn={this.state.isLogedIn} handleLogIn={this.handleLogIn}/>
      </div>
    );
  }
}

export default App;
