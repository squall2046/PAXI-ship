import _ from "lodash";
import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import { StandaloneSearchBox } from "react-google-maps/lib/components/places/StandaloneSearchBox";

const ReactGoogleMaps = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDjoSsxAf-IKE0ALE9n8poJ1kJ9pq622e4&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `88%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        places: [],

        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          console.log(this.props)
          const places = refs.searchBox.getPlaces();
          this.setState({
            places,
            aLat: this.props.lat,
            aLng: this.props.lng,
            bLat: places[0].geometry.location.lat(),
            bLng: places[0].geometry.location.lng(),
          });
          // console.log("location.lat: ", places[0].geometry.location.lat())
          // console.log("state.bLat: ", this.state.bLat)

          const DirectionsService = new window.google.maps.DirectionsService();
          DirectionsService.route({
            origin: new window.google.maps.LatLng(this.state.aLat, this.state.aLng),
            destination: new window.google.maps.LatLng(this.state.bLat, this.state.bLng),
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              this.setState({
                directions: result,
              });
            } else {
              console.log(`no fetching directions yet`, result);
            }
          });
        },
      })
    },
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new window.google.maps.LatLng(37.5759, -77.5410)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
    <div data-standalone-searchbox="">
      <StandaloneSearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        onPlacesChanged={props.onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Enter Destination"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `100%`,
            height: `32px`,
            padding: `0 12px`,
            marginTop: `4px`,
            marginLeft: `0px`,
            borderRadius: `23px`,
            boxShadow: ` 0px 30px 40px 10px rgba(260, 10, 20, 0.405)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            borderRadius: '50px 50px 0px 0px',
            borderBottom: '3px black solid',
            borderLeft: '2px black solid',
            borderRight: '2px black solid',
            borderTop: '2px black solid',
            textAlign: 'center'
          }}
        />
      </StandaloneSearchBox>
      <ol>
        {props.places.map(({ place_id, formatted_address, geometry: { location } }) =>
          <li key={place_id}>
            {formatted_address}
            {" at "}
            ({location.lat()},{location.lng()})
        </li>
        )}
      </ol>
    </div>
  </GoogleMap>
);

const enhance = _.identity;

export default enhance(ReactGoogleMaps);
