const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const searchButton = document.getElementById('search');
const cityInput = document.getElementById('city');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');

searchButton.addEventListener('click', () => {
  const city = cityInput.value;
  if (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        cityName.textContent = `City: ${data.name}`;
        temperature.textContent = `Temperature: ${data.main.temp}°C`;
        description.textContent = `Weather: ${data.weather[0].description}`;
      })
      .catch(error => {
        cityName.textContent = 'City not found!';
        temperature.textContent = '';
        description.textContent = '';
      });
  }
});
