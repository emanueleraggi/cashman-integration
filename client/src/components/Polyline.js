import { Component } from 'react'

export default class Polyline extends Component {
  renderPolylines () {
        const { markers, map, maps, lineColor } = this.props

        /** Example of rendering geodesic polyline */
        let geodesicPolyline = new maps.Polyline({
            path: markers,
            geodesic: true,
            strokeColor: lineColor,
            strokeOpacity: 1.0,
            strokeWeight: 4
        })
        if (markers.length !== 0) {
            geodesicPolyline.setMap(map);
        } else {
            geodesicPolyline.setMap(null);
        }

        /** Example of rendering non geodesic polyline (straight line) */
        let nonGeodesicPolyline = new maps.Polyline({
            path: markers,
            geodesic: false,
            strokeColor: lineColor,
            strokeOpacity: 0.7,
            strokeWeight: 3
        })
        if (markers.length !== 0) {
            nonGeodesicPolyline.setMap(map);
        } else {
            nonGeodesicPolyline.setMap(null);
        }
    }

    render () {
        this.renderPolylines()
        return null
    }
}