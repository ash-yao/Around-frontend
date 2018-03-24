import React from 'react';
import { Register } from "./Register";
import { Login } from './Login';
import {Switch, Route} from 'react-router';

export class Main extends React.Component {
    render() {
        return (<div className="Main">
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <Route component={Register}/>
            </Switch>
        </div>)
    }
}