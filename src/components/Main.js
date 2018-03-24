import React from 'react';
import { Register } from "./Register";
import { Login } from './Login';
import {Switch, Route, Redirect} from 'react-router';
import {Home} from './Home';

export class Main extends React.Component {
    getLogin = ()=>{
        return this.props.isLogedIn ? <Redirect to="/home"/> : <Login handleLogIn={this.props.handleLogIn}/>
    }
    getHome = ()=>{
        return this.props.isLogedIn ? <Home/> : <Redirect to="/login"/>
    }
    getRoot = ()=>{
        return <Redirect to="/login"/>
    }
    render() {
        return (<div className="Main">
            <Switch>
                <Route exact path="/" render={this.getRoot}/>
                <Route exact path="/login" render={this.getLogin}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/home" render={this.getHome}/>
                <Route render={this.getRoot}/>
            </Switch>
        </div>)
    }
}