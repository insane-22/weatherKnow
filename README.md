# Weather-Know
## Overview
Weather-Know is simple weather application built with React and Vite, using the OpenWeatherMap API for fetching current weather and  weather forecast for the next 5 days.

## Table Of Content

- [Installation](#installation)
- [Features](#features)
- [Usage Instructions](#usage-instructions)

## Installation

You can follow these instructions to setup a dev environment:

- Clone the repository: 
```bash
git clone https://github.com/insane-22/weatherKnow.git
```
- Install the dependencies:
 ```bash
 cd weatherKnow
 npm install
 ```
- Configure your API key:
  - Go to OpenweatherMap's website https://home.openweathermap.org/ and sign up there.
  - After signing in, you can get your API key from https://home.openweathermap.org/api_keys
  - Copy the example env file and rename it as .env, you can use the following command to do the same:
  ```bash
  cp .env.example .env
  ```
  - Add your API key to this file.
- Start the development server:
```bash
npm run dev
```
- Open your browser and navigate to the address shown in the terminal (http://localhost:5173)

## Features
- **Current Weather**: Displays the current temperature, humidity, and weather conditions for the specified city.
- **5-Day Forecast**: Provides a 5-day weather forecast (filtered to one entry per day).
- **Local Caching**: Caches API responses locally to minimize redundant API calls and enhance performance.
- User-friendly UI with error handling.

## Usage Instructions
- Enter the name of a city in the input field.
- Click Current Weather to view the current weather conditions for the city.
- Click 5-Day Forecast to view daily weather data for the next five days.
- If you enter an invalid city name or exceed the API call limit, an error message will be displayed.