import React, { Component } from "react"
import "./WeatherApi.scss"
import axios from "axios"
import { geolocated } from "react-geolocated";
import kelvinToCelsius from "kelvin-to-celsius";

class WeatherApi extends Component {
  constructor() {
    super();
    this.state = {
      lon: null,
      lat: null,
      weatherData: null,
      weatherDataCondition: [],
      isLoading: true
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coords !== this.props.coords) {
      this.setState({
        lat: nextProps.coords.latitude,
        lon: nextProps.coords.longitude,
      }, function () {
        let self = this;
        self.fetchData(this.state.lat, this.state.lon)
      })
    }
  }

  fetchData(lat, lon) {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=ca39c68815edbaae5b601563aa4bc6c7`)
      .then((res) => {
        this.setState({
          weatherData: res.data,
          weatherDataCondition: res.data.list.filter((value, index, self) => { return self.indexOf(value) % 8 === 0; }),
          isLoading: false
        });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }
  render() {
    const { weatherData, weatherDataCondition } = this.state;
    return (
      <div className="Weather">
        {this.state.isLoading ? <p>loading data</p> :
          weatherDataCondition.map(function (weatherDataCondition, index) {
            const IMGURL = `https://openweathermap.org/img/w/${weatherDataCondition.weather[0].icon}.png`
            return (
              <div className="display-conditions" key={index}>
                <p className="display-conditions-item">Location : {weatherData.city.name}, {weatherData.city.country}</p>
                <p className="display-conditions-item">Temperature: {kelvinToCelsius(weatherDataCondition.main.temp)} C</p>
                <p className="weather-condition-container display-conditions-item">
                  <img className="img-fluid" alt="icon" src={IMGURL} />
                  Weather Condition: <em>{weatherDataCondition.weather[0].description}</em>
                </p>
                <p className="display-conditions-item">Humidity: {weatherDataCondition.main.humidity}</p>
                <p className="display-conditions-item">Wind Speed: {weatherDataCondition.wind.speed}</p>
              </div>
            );
          })
        }
      </div>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(WeatherApi);
