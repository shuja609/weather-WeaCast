// Theme Toggle Functionality
// --------------------------
// Get the toggle switch input and the body element
const themeToggle = document.querySelector('.ui-switch input');
const body = document.body;

// Function to toggle between dark and light themes
function toggleTheme() {
  if (themeToggle.checked) {
    body.classList.add('dark-theme'); // Activate dark theme
    body.classList.remove('light-theme');
  } else {
    body.classList.add('light-theme'); // Activate light theme
    body.classList.remove('dark-theme');
  }
}

// Event listener for the toggle switch
themeToggle.addEventListener('change', toggleTheme);

// Set the initial theme based on the current body class
if (body.classList.contains('dark-theme')) {
  themeToggle.checked = true; // Check the toggle switch if dark theme is active
}

// Get the modal and user profile icon
const modal = document.getElementById('developerDetailsModal');
const userProfile = document.getElementById('userProfile');
const closeBtn = document.querySelector('.close');

// Show modal when the user icon is clicked
userProfile.addEventListener('click', () => {
  modal.style.display = 'block';
  modal.classList.add('fade-in'); // Add fade-in animation class
  setTimeout(() => {
    modal.classList.remove('fade-in'); // Remove fade-in class after animation completes
  }, 3000); // Duration of the animation in milliseconds
});

// Close modal when the close button is clicked
closeBtn.addEventListener('click', () => {
  modal.classList.add('fade-out'); // Add fade-out animation class
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fade-out'); // Remove fade-out class after animation completes
  }, 300); // Duration of the animation in milliseconds
});

// Close modal when the user clicks outside the modal
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('fade-out'); // Add fade-out animation class
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.remove('fade-out'); // Remove fade-out class after animation completes
    }, 300); // Duration of the animation in milliseconds
  }
});

// Close modal when the close button is clicked
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when the user clicks outside the modal
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});




// Weather Data Fetching
// ---------------------
// Function to fetch weather data based on the city input
async function fetchWeatherData(city) {
  const apiKey = '25b867c436580460135dbf82395c0973'; // Replace with your actual OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();

    // Log fetched weather data
    // console.log('City:', data.name);
    // console.log('Temperature:', data.main.temp, '°C');
    // console.log('Weather:', data.weather[0].description);
    // console.log('Wind Speed:', data.wind.speed, 'm/s');
    // console.log('Humidity:', data.main.humidity, '%');
    // console.log('Pressure:', data.main.pressure, 'hPa');
    // console.log('Sunrise:', new Date(data.sys.sunrise * 1000).toLocaleTimeString());
    // console.log('Sunset:', new Date(data.sys.sunset * 1000).toLocaleTimeString());

    // Update weather information on the UI
    updateWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}
 
// Function to fetch weather data based on latitude and longitude
async function fetchWeatherDataByCoords(latitude, longitude) {
  const apiKey = '25b867c436580460135dbf82395c0973'; // Replace with your actual OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();

    // Update weather information on the UI
    updateWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Function to get user's location and fetch weather data
function getUserLocationAndFetchWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch weather data using user's coordinates
        fetchWeatherDataByCoords(latitude, longitude);
        fetchFiveDayWeatherForecast2(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        fetchWeatherData('london');
        alert('Unable to retrieve your location. Please enter the city name.');
      }
    );
  } else {
    fetchWeatherData('london');
    alert('Geolocation is not supported by this browser. Please enter the city name.');
  }
}




// Updating Weather Data in UI
// ---------------------------
let temperatureInCelsius = 0; // Global variable to store temperature in Celsius

// Function to update weather data in the DOM
function updateWeatherData(weatherData) {
  temperatureInCelsius = weatherData.main.temp;

  // Update city name
  document.getElementById('city').textContent = weatherData.name;

  // Update weather description
  const weatherDescription = weatherData.weather[0].description;
  document.getElementById('description').textContent = weatherDescription;

  // Update temperature (in Celsius initially)
  const temperature = `${Math.round(weatherData.main.temp)}°C`;
  document.getElementById('temperature').textContent = temperature;

  // Update weather details (wind speed, humidity, pressure, sunrise, sunset)
  document.querySelector('.weather-details').innerHTML = `
    <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
    <p>Humidity: ${weatherData.main.humidity} %</p>
    <p>Pressure: ${weatherData.main.pressure} hPa</p>
    <p>Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
    <p>Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
  `;

  // Update weather icon
  const weatherIconCode = weatherData.weather[0].icon;
  const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
  document.getElementById('icon').innerHTML = `<img src="${weatherIconUrl}" alt="Weather Icon">`;

  // Update current date, day, and time
  const currentDate = new Date();
  document.getElementById('day').textContent = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  document.getElementById('date').textContent = currentDate.toLocaleDateString();
  document.getElementById('time').textContent = currentDate.toLocaleTimeString();
}

let isCelsius = true; // Global variable to store the temperature unit (Celsius/Fahrenheit)
// Celsius/Fahrenheit Temperature Toggle
// -------------------------------------
// Function to update the temperature display between Celsius and Fahrenheit
function updateTemperatureDisplay() {
  const isFahrenheit = document.getElementById('cb3-8').checked;
  let temperatureDisplay;

  if (isFahrenheit) {
    // Convert Celsius to Fahrenheit
    const temperatureInFahrenheit = (temperatureInCelsius * 9 / 5) + 32;
    temperatureDisplay = `${Math.round(temperatureInFahrenheit)}°F`;
    isCelsius = false;
  } else {
    // Display temperature in Celsius
    temperatureDisplay = `${Math.round(temperatureInCelsius)}°C`;
    isCelsius = true;
  }

  document.getElementById('temperature').textContent = temperatureDisplay;
}

// Event listener for temperature unit toggle
document.getElementById('cb3-8').addEventListener('change', updateTemperatureDisplay);


// City Search Event Listener
// --------------------------
// Event listener for search button to fetch weather data
let searchCity='london';
document.getElementById('searchBtn').addEventListener('click', () => {

  const city = document.getElementById('cityInput').value;
  searchCity=city;
  if (city) {
    fetchWeatherData(city); // Fetch weather data for the entered city
    fetchFiveDayWeatherForecast(city); // Fetch 5-day weather forecast data
    document.getElementById('cityInput').value = ''; // Clear the input field after search
  } else {
    alert('Please enter a city name.'); // Alert if city is not entered
  }
});

// Event listener for pressing Enter key in the city input field
document.getElementById('cityInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    document.getElementById('searchBtn').click(); // Trigger the search button click event
  }
});



//forcast sectionm
// Function to fetch 5-day weather forecast data based on latitude and longitude input
async function fetchFiveDayWeatherForecast2(latitude, longitude) {
  const apiKey = '25b867c436580460135dbf82395c0973'; // Replace with your actual OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
     console.assert;
    }
    const data = await response.json();
    console.log(data);
       // Prepare data for the chart
    const dailyTemperatures = [];
    const labels = [];

    // Loop through the forecast data, grouped by days
    const dayData = {};
    if (data && data.list && Array.isArray(data.list)) {
    data.list.forEach(entry => {
      const date = new Date(entry.dt * 1000); // Convert timestamp to Date object
      const dayName = date.toLocaleString('en-US', { weekday: 'long' }); // Get the day name

      // Store temperature data per day
      if (!dayData[dayName]) {
      dayData[dayName] = { totalTemp: 0, count: 0 };
      labels.push(dayName); // Add day name to labels if it doesn't exist
      }

      let temperature = entry.main.temp;
      if (!isCelsius) {
      // Convert Celsius to Fahrenheit if isCelsius is false
      temperature = (temperature * 9 / 5) + 32;
      }

      dayData[dayName].totalTemp += temperature; // Sum the temperatures
      dayData[dayName].count++; // Count the number of entries
    });
  } else {
    console.error('API response is not in the expected format:', data);
  }

    // Calculate average temperatures for each day
    for (const day in dayData) {
      const averageTemp = dayData[day].totalTemp / dayData[day].count;
      dailyTemperatures.push(averageTemp); // Store the average temperature
    }

    // Ensure we only keep the data for the first 5 days
    const limitedLabels = labels.slice(0, 5);
    const limitedTemperatures = dailyTemperatures.slice(0, 5);

    // Create the bar chart
    createBarChart(limitedTemperatures, limitedLabels);
    createDoughnutChart(data);
    createLineChart(data);
    // displayWeatherDataTable(data.list);
    // forecastData = data.list; // Store the forecast data globally
    //   filteredData = [...forecastData];
    //   // Calculate the total number of pages
    //   totalPages = Math.ceil(forecastData.length / entriesPerPage);
    //   displayWeatherDataTable();
   
    return data; // Return the JSON response
  }  catch (error) {
    console.error('Error fetching 5-day weather forecast:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}
// Function to fetch 5-day weather forecast data based on the city input
async function fetchFiveDayWeatherForecast(city) {
  const apiKey = '25b867c436580460135dbf82395c0973'; // Replace with your actual OpenWeather API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
     console.assert;
    }
    const data = await response.json();
    console.log(data);
       // Prepare data for the chart
    const dailyTemperatures = [];
    const labels = [];

    // Loop through the forecast data, grouped by days
    const dayData = {};
    if (data && data.list && Array.isArray(data.list)) {
    data.list.forEach(entry => {
      const date = new Date(entry.dt * 1000); // Convert timestamp to Date object
      const dayName = date.toLocaleString('en-US', { weekday: 'long' }); // Get the day name

      // Store temperature data per day
      if (!dayData[dayName]) {
      dayData[dayName] = { totalTemp: 0, count: 0 };
      labels.push(dayName); // Add day name to labels if it doesn't exist
      }

      let temperature = entry.main.temp;
      if (!isCelsius) {
      // Convert Celsius to Fahrenheit if isCelsius is false
      temperature = (temperature * 9 / 5) + 32;
      }

      dayData[dayName].totalTemp += temperature; // Sum the temperatures
      dayData[dayName].count++; // Count the number of entries
    });
  } else {
    console.error('API response is not in the expected format:', data);
  }

    // Calculate average temperatures for each day
    for (const day in dayData) {
      const averageTemp = dayData[day].totalTemp / dayData[day].count;
      dailyTemperatures.push(averageTemp); // Store the average temperature
    }

    // Ensure we only keep the data for the first 5 days
    const limitedLabels = labels.slice(0, 5);
    const limitedTemperatures = dailyTemperatures.slice(0, 5);

    // Create the bar chart
    createBarChart(limitedTemperatures, limitedLabels);
    createDoughnutChart(data);
    createLineChart(data);
    // displayWeatherDataTable(data.list);
    // forecastData = data.list; // Store the forecast data globally
    //   filteredData = [...forecastData];
    //   // Calculate the total number of pages
    //   totalPages = Math.ceil(forecastData.length / entriesPerPage);
    //   displayWeatherDataTable();
   
    return data; // Return the JSON response
  } catch (error) {
    console.error('Error fetching 5-day weather forecast:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}

// Function to create a bar chart for temperature display
function createBarChart(temperatures, labels) {
  const ctx = document.getElementById("barChart").getContext("2d");

  // Destroy previous chart instance if exists
  if (typeof barChartInstance !== 'undefined') {
    barChartInstance.destroy();
  }

  // Determine the label for the y-axis based on the temperature unit
  const yAxisLabel = isCelsius ? 'Temperature (°C)' : 'Temperature (°F)';

  // Set the canvas height to the available height of the parent div, with a max height
  const parentDiv = document.getElementById("barChart").parentElement;
  ctx.canvas.height = Math.min(parentDiv.clientHeight, 350); // Limit the height to a max of 350px

  // Create a new chart
  barChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels, // Days
      datasets: [{
        label: yAxisLabel, // Label for the dataset
        data: temperatures, // Temperature data for the next 5 days
        backgroundColor: "#e67e22", // Bar color
        borderColor: "#0054d3", // Bar border color
        borderWidth: 1,
        barThickness: 20, // Set the bar thickness to narrow down the bars
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel, // Display title for y-axis
          },
          ticks: {
          }
        },
        x: {
          ticks: {
          }
        }
      },
      plugins: {
        legend: {
          labels: {
          }
        }
      },
      animations: {
        // Add animation settings
        x: {
          type: 'number',
          duration: 1000, // Animation duration for bars
          delay: (context) => {
            if (context.type === 'data' && context.mode === 'default' && !context.chart.chartArea) {
              return 0; // No delay if the chart area is not defined
            }
            return context.index * 100; // Add delay based on index
          },
        },
        y: {
          type: 'number',
          duration: 1000, // Animation duration for y-axis
          easing: 'easeOutBounce', // Easing function for y-axis animation
        },
        // You can customize more animations as needed
      },
    },
  });
}

// Function to create a doughnut chart for weather conditions
function createDoughnutChart(data) {
  const ctx = document.getElementById("doughnutChart").getContext("2d");

  // Destroy previous chart instance if exists
  if (typeof doughnutChartInstance !== 'undefined') {
      doughnutChartInstance.destroy();
  }

  // Prepare data for the chart
  const weatherConditionsCount = {};

  // Iterate over each entry in the forecast
  data.list.forEach(entry => {
      const condition = entry.weather[0].main; // Get the main weather condition
      // Count occurrences
      weatherConditionsCount[condition] = (weatherConditionsCount[condition] || 0) + 1;
  });

  // Prepare data for the doughnut chart
  const labels = Object.keys(weatherConditionsCount);
  const counts = Object.values(weatherConditionsCount);

  // Create the doughnut chart
  doughnutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: labels,
          datasets: [{
              data: counts,
              backgroundColor: [
                  'rgba(255, 205, 86, 0.6)', // Yellow for Clear
                  'rgba(54, 162, 235, 0.6)', // Blue for Rain
                  'rgba(255, 99, 132, 0.6)', // Red for Cloudy
                  'rgba(75, 192, 192, 0.6)', // Green for Others
                  'rgba(153, 102, 255, 0.6)'  // Purple for Unknown
              ],
              borderColor: [
                  'rgba(255, 205, 86, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          animation: {
              animateScale: true,
              animateRotate: true,
              duration: 1000, // Animation duration in milliseconds
              delay: (context) => {
                  if (context.type === 'data' && context.mode === 'default' && !context.dropped) {
                      return context.dataIndex * 100; // Delay for each slice, 100ms per slice
                  }
                  return 0; // No delay for other animations
              }
          },
          plugins: {
              legend: {
                  position: 'top',
              },
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          const label = tooltipItem.label || '';
                          const count = tooltipItem.raw || 0;
                          return `${label}: ${count} occurrence(s)`;
                      }
                  }
              }
          }
      }
  });
}

//let lineChartInstance;
// Function to create a line chart for temperature forecast
function createLineChart(data) {
  const ctx = document.getElementById("lineChart").getContext("2d");

  // Destroy previous chart instance if exists
  if (typeof lineChartInstance !== 'undefined') {
    lineChartInstance.destroy();
  }

  // Prepare temperature data for the next 5 days
  const labels = []; // To store the days
  const temperatures = []; // To store the temperatures

  // Iterate over the data to extract temperature information
  data.list.forEach((entry, index) => {
    // We assume we have one entry every 3 hours, so we take the first temperature for each day
    if (index % 8 === 0) { // 24 hours / 3 hours = 8 entries in a day
      const date = new Date(entry.dt * 1000); // Convert UNIX timestamp to Date
      labels.push(date.toLocaleString('en-US', { weekday: 'long' })); // Get the day name
      temperatures.push(entry.main.temp); // Push the temperature
    }
  });

  // Set the canvas height to the available height of the parent div, with a max height
  const parentDiv = document.getElementById("lineChart").parentElement;
  ctx.canvas.height = Math.min(parentDiv.clientHeight, 350); // Limit the height to a max of 350px

  // Create the line chart
  lineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: '#0054d3',
        backgroundColor: '#ff660061',
        borderWidth: 2,
        fill: true, // Fill the area under the line
        pointRadius: 5, // Size of points
        pointHoverRadius: 7, // Size of points when hovered
        tension: 0.1 // Smoothness of the line
      }]
    },
    options: {
      responsive: true,
      
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              const label = tooltipItem.label || '';
              const temp = tooltipItem.raw || 0;
              return `${label}: ${temp}°C`;
            }
          }
        }
      },
      animation: {
        // Enable drop animation
        y: {
          type: "number",
          duration: 1000, // Duration of the animation (in ms)
          easing: "easeOutBounce", // Easing function for the animation
          from: (context) => {
            // Animate from a higher value (for drop effect)
            if (context.active) {
              return context.chart.scales.y.max + 10; // Start above the maximum y value
            }
            return null; // Don't animate if not active
          },
        },
        x: {
          duration: 1000, // Duration for the x-axis animation (in ms)
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Day'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)'
          },
          beginAtZero: false // Allow y-axis to start at the lowest temperature
        }
      }
    }
  });
}


fetchFiveDayWeatherForecast('london');
fetchWeatherData('london');
getUserLocationAndFetchWeather();



const sidebar = document.querySelector('.sidebar');
const toggleButton = document.getElementById('sidebarToggle');
const closeButton = document.getElementById('closeSidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active'); // Add or remove the 'active' class
});

// Close the sidebar when the close button is clicked
closeButton.addEventListener('click', () => {
    sidebar.classList.remove('active'); // Remove the 'active' class to hide the sidebar
});
