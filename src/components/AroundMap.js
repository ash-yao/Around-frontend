import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap} from 'react-google-maps';
import {AroundMarker} from "./AroundMarker";
import {POS_KEY} from "../constants";

class MyMap extends React.Component {
    reloadMarkers = () => {
        const center = this.map.getCenter();
        const position = { latitude: center.lat(), longitude: center.lng() };
        this.props.loadPosts(position, this.getRange());
    }

    getRange = () => {
        const google = window.google;
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new google.maps.LatLng(center.lat(), ne.lng());
            return 0.000621371192 * google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    getMapRef = (map) => {
        this.map = map;
        window.thismap = map;
    }

    render() {
        const pos = JSON.parse(localStorage.getItem(POS_KEY));
        return <GoogleMap
            onDragEnd={this.reloadMarkers}
            onZoomChanged={this.reloadMarkers}
            defaultZoom={10}
            defaultCenter={{ lat: pos.latitude, lng: pos.longitude }}
            ref={this.getMapRef}
        >
            {this.props.posts && this.props.posts.length > 0 ? this.props.posts.map((post) => {
                return <AroundMarker post = {post} key = {post.url}/>
            }) : null}
        </GoogleMap>
    }
}

export const AroundMap = withScriptjs(withGoogleMap(MyMap));