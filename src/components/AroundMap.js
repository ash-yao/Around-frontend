import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap} from 'react-google-maps';
class MyMap extends React.Component {
    render() {
        return <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: -34.397, lng: 150.644 }}
        />
    }
}

export const AroundMap = withScriptjs(withGoogleMap(MyMap));