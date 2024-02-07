import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  styled,
} from '@mui/material';
import {
  WiDaySunny,
  WiDayCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiCloud,
  WiDust
} from 'react-icons/wi';

const BackgroundContainer = styled('div')({
  backgroundColor: '#F0F4C3',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledPaper = styled(Paper)(({ theme, weatherType }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  borderRadius: 16,
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
  width: '90%',
  maxWidth: 600,
  background: '#FFFFFF',
  color: '#333333',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const useStyles = {
  icon: {
    fontSize: 120,
    marginBottom: '20px',
  },
  formPaper: {
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    borderRadius: 16,
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: 600,
    background: '#FFFFFF',
    color: '#333333',
  },
  button: {
    marginTop: '20px',
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
  fiveDayForecastContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end', // Align to the right side
  },
  forecastItem: {
    marginBottom: '10px',
    width: '100%',
    background: '#E0E0E0',
    color: '#333333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '8px',
  },
  forecastIcon: {
    fontSize: '64px',
    marginBottom: '10px',
  },
};

const LoadingIndicator = () => <CircularProgress size={24} color="inherit" />;

const WeatherIcon = ({ description }) => {
  const getWeatherIcon = () => {
    switch (description.toLowerCase()) {
      case 'clear':
        return <WiDaySunny style={useStyles.icon} />;
      case 'clouds':
        return <WiDayCloudy style={useStyles.icon} />;
      case 'rain':
        return <WiRain style={useStyles.icon} />;
      case 'snow':
        return <WiSnow style={useStyles.icon} />;
      case 'thunderstorm':
        return <WiThunderstorm style={useStyles.icon} />;
      case 'mist':
        return <WiCloud style={useStyles.icon} />;
      case 'haze':
        return <WiDust style={useStyles.icon} />;
      default:
        return null;
    }
  };

  return getWeatherIcon();
};

const WeatherDisplay = ({ city, weatherData }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  return (
    <StyledPaper weatherType={weatherData.description}>
      <Typography variant="h5" gutterBottom>
        {city} Weather
      </Typography>
      <WeatherIcon description={weatherData.description} />
      <Typography variant="h6">Temperature: {weatherData.temperature}°C</Typography>
      <Typography variant="body1">Description: {weatherData.description}</Typography>
      <Typography variant="body2" color="textSecondary">
        {formattedDate} | {formattedTime}
      </Typography>
    </StyledPaper>
  );
};

const WeatherForm = ({ inputCity, setInputCity, handleSearch, loading }) => (
  <StyledPaper style={useStyles.formPaper}>
    <TextField
      fullWidth
      label="Enter City"
      variant="outlined"
      value={inputCity}
      onChange={(e) => setInputCity(e.target.value)}
      style={{ marginBottom: '16px' }}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handleSearch}
      disabled={loading}
      style={useStyles.button}
    >
      {loading ? <LoadingIndicator /> : 'Search'}
    </Button>
  </StyledPaper>
);

const generateTemperature = (description) => {
  switch (description.toLowerCase()) {
    case 'sunny':
      return Math.floor(Math.random() * 15) + 20;
    case 'cloudy':
      return Math.floor(Math.random() * 10) + 15;
    case 'rainy':
      return Math.floor(Math.random() * 5) + 10;
    case 'snowy':
      return Math.floor(Math.random() * 5);
    case 'thunderstorm':
      return Math.floor(Math.random() * 10) + 15;
    default:
      return Math.floor(Math.random() * 30) + 10;
  }
};

const WeatherApp = () => {
  const [inputCity, setInputCity] = useState('');
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);

  const fetchFiveDayForecast = async () => {
    try {
      const response = await Axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&appid=17bbb9fa59efee2a8ca069c445945be4`);
      const forecastData = response.data.list.slice(0, 5); // Get forecast data for the next five days
      setFiveDayForecast(forecastData);
    } catch (error) {
      console.error('Error fetching five-day forecast:', error);
    }
  };

  useEffect(() => {
    if (inputCity.trim() && !weatherData) {
      fetchFiveDayForecast();
    }
  }, [inputCity, weatherData]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!inputCity.trim()) {
        return;
      }

      const response = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=17bbb9fa59efee2a8ca069c445945be4`);
      const currentWeather = response.data;

      const liveWeatherData = {
        temperature: Math.round(currentWeather.main.temp - 273.15),
        description: currentWeather.weather[0].main,
      };

      setWeatherData(liveWeatherData);
      setCity(inputCity);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Invalid city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const FiveDayForecast = () => (
    <div style={useStyles.fiveDayForecastContainer}>
      <Typography variant="h5" gutterBottom>
        Five-Day Forecast
      </Typography>
      {fiveDayForecast.map((forecast, index) => (
        <Paper key={index} style={useStyles.forecastItem}>
          <Typography variant="subtitle1">{forecast.dt_txt}</Typography>
          <Typography variant="body1">Temperature: {Math.round(forecast.main.temp - 273.15)}°C</Typography>
          <Typography variant="body2">Description: {forecast.weather[0].description}</Typography>
          <WeatherIcon description={forecast.weather[0].main} style={useStyles.forecastIcon} />
        </Paper>
      ))}
    </div>
  );

  return (
    <BackgroundContainer>
      <Typography variant="h3" align="center" gutterBottom>
        Weather Report
      </Typography>
      <WeatherForm inputCity={inputCity} setInputCity={setInputCity} handleSearch={handleSearch} loading={loading} />

      {weatherData && <WeatherDisplay city={city} weatherData={weatherData} />}
      {fiveDayForecast.length > 0 && <FiveDayForecast />}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </BackgroundContainer>
  );
};

export default WeatherApp;
