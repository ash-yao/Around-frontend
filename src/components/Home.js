import React from 'react';
import { Tabs, Button, Spin} from 'antd';
import {GEO_OPTIONS, API_ROOT, AUTH_PREFIX, POS_KEY, TOKEN_KEY} from "../constants";
import $ from 'jquery';
const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        loadingGeo : false,
        loadingPosts: false,
        error: '',
        posts:[]
    }
    getGeolocation = ()=> {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessGetGeo,
                this.onFailGetGeo, GEO_OPTIONS);
        } else {
            this.setState({ error: 'Your browser does not support geolocation!' });
        }
    }
    loadPosts = ()=>{
        const lat = 37.7915953;
        const lon = -122.3937977;
        this.setState({ loadingPosts: true, error: ''});
        $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
            method:'GET',
            headers:{Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`}
        }).then((response) => {
            this.setState({ posts: response, loadingPosts: false, error: '' });
            console.log(response);
        }, (error) => {
            this.setState({ loadingPosts: false, error: error.responseText });
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.setState({loadingGeo: true});
        this.getGeolocation();
    }
    onSuccessGetGeo = (position)=>{
        this.setState({loadingGeo : false, error:''});
        console.log(position);
        const{latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({latitude, longitude}))
        this.loadPosts();
    }
    onFailGetGeo = ()=>{
        this.setState({ loadingGeoLocation: false, error: 'Failed to load geo location!' });
    }

    getGalleryContent = ()=>{
        if (this.state.error) return <h2>{this.state.error}</h2>
        if (this.state.loadingGeo)
            return <Spin size='large' tip = 'Loading Geo Location' className='home-gallery-spin'/>
        if (this.state.loadingPosts)
            return <Spin size='large' tip = 'Loading Posts' className='home-gallery-spin'/>
        return <h2>Success</h2>
    }

    render() {
        const operations = <Button type='primary'>Create New Post</Button>
        return (<Tabs tabBarExtraContent={operations} className = 'main-tabs'>
            <TabPane tab="Posts" key="1">
                {this.getGalleryContent()}
            </TabPane>
            <TabPane tab="Map" key="2">Content of tab 2</TabPane>
        </Tabs>)
    }
}