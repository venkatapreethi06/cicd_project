# Weather App

A modern, responsive weather application built with HTML, CSS, and JavaScript. Features include current weather conditions, 5-day forecasts, weather maps, and a timeline view with precipitation data.

## Features

- 🌤️ Current weather conditions with beautiful glassmorphism UI
- 📍 Location-based weather using geolocation
- 🔍 City search functionality
- 🗺️ Interactive weather maps with Leaflet
- 📊 5-day weather forecast
- ⏰ Hourly weather timeline with precipitation indicators
- 📱 Fully responsive design
- 💌 Feedback system with email integration
- 🌍 World weather view

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: OpenWeatherMap API
- **Maps**: Leaflet.js
- **Icons**: Font Awesome
- **Email**: Formspree integration
- **Styling**: Glassmorphism design with CSS variables

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Deployment

#### Using Docker Compose (Recommended)

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. Access the application at [http://localhost:3000](http://localhost:3000)

#### Using Docker directly

1. Build the Docker image:
   ```bash
   docker build -t weather-app .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 weather-app
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## API Configuration

The app uses the OpenWeatherMap API. Make sure to:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the API key in the JavaScript files (`js/main.js`, `js/search.js`, `js/world.js`)

## Project Structure

```
weather-app/
├── index.html          # Main page
├── search.html         # Search page
├── world.html          # World view page
├── css/
│   ├── style.css       # Main styles
│   ├── search.css      # Search page styles
│   └── world.css       # World page styles
├── js/
│   ├── main.js         # Main page logic
│   ├── search.js       # Search functionality
│   └── world.js        # World view logic
├── img/                # Weather icons
├── public/             # Static assets
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose setup
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run serve` - Alternative server command

## Docker Commands

```bash
# Build the image
docker build -t weather-app .

# Run the container
docker run -p 3000:3000 weather-app

# Using Docker Compose
docker-compose up --build
docker-compose down
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License

This project is licensed under the MIT License.
