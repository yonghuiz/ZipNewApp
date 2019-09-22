/**
 * Created by liuyu on 2017/11/9.
 */
import React, { PureComponent } from 'react'
import MapView from 'react-native-maps'

export default class ZiplockerLocation extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MapView
                style={{flex:1}}
                initialRegion={{
                    latitude:parseFloat(this.props.ziplocker.latitude),
                    longitude:parseFloat(this.props.ziplocker.longitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <MapView.Marker
                    title={`zipporaId: ${this.props.ziplocker.cabinetId}`}
                    description={this.props.ziplocker.address}
                    coordinate={{
                        latitude:parseFloat(this.props.ziplocker.latitude),
                        longitude:parseFloat(this.props.ziplocker.longitude),
                    }}
                >
                </MapView.Marker>
            </MapView>
        )
    }
}