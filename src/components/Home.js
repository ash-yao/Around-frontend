import React from 'react';
import { Tabs, Button, Spin} from 'antd';
import {Gallery} from "./Gallery";
import {GEO_OPTIONS, API_ROOT, AUTH_PREFIX, POS_KEY, TOKEN_KEY} from "../constants";
import {PostButton} from "./PostButton";
import {AroundMap} from "./AroundMap";
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
    loadPosts = (location, radius)=>{
        const { latitude, longitude } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        this.setState({ loadingPosts: true, error: ''});
        return $.ajax({
            url: `${API_ROOT}/search?lat=${latitude}&lon=${longitude}&range=${range}`,
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
        if (this.state.posts && this.state.posts.length > 0) {
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                }
            });
            return <Gallery images={images}/>;
        }
        return null;
    }

    render() {
        const operations = <PostButton loadPosts={this.loadPosts}/>
        return (<Tabs tabBarExtraContent={operations} className = 'main-tabs'>
            <TabPane tab="Posts" key="1">
                {this.getGalleryContent()}
            </TabPane>
            <TabPane tab="Map" key="2">
                <AroundMap
                    loadPosts={this.loadPosts}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    posts = {this.state.posts}
            /></TabPane>
        </Tabs>)
    }
}