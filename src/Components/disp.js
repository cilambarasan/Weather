// WeatherDisplay.js
import React from 'react';
import { Typography, Paper } from '@mui/material';
import {
  WiDaySunny,
  WiDayCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from 'react-icons/wi';

const WeatherDisplay = ({ city, weatherData }) => {
  const getWeatherIcon = (description) => {
    switch (description.toLowerCase()) {
      case 'sunny':
        return <WiDaySunny fontSize="inherit" />;
      case 'cloudy':
        return <WiDayCloudy fontSize="inherit" />;
      case 'rainy':
        return <WiRain fontSize="inherit" />;
      case 'snowy':
        return <WiSnow fontSize="inherit" />;
      case 'thunderstorm':
        return <WiThunderstorm fontSize="inherit" />;
      default:
        return null;
    }
  };

  return (
    <Paper>
      <Typography variant="h5" gutterBottom>
        Weather in {city}
      </Typography>
      {getWeatherIcon(weatherData.description)}
      <Typography variant="h6">Temperature: {weatherData.temperature}°C</Typography>
      <Typography variant="body1">Description: {weatherData.description}</Typography>
    </Paper>
  );
};

export default WeatherDisplay;
