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

document.getElementById('searchBtn').addEventListener('click', () => {

    const city = document.getElementById('cityInput').value;
    searchCity=city;
    if (city) {
      fetchFiveDayWeatherForecastfortable(city); // Fetch the 5-day weather forecast for the city
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


//chatbot section start----------------------------------------------------------------------------------
const API_KEY = "AIzaSyA3WKYFSixfc2EBlva8rCmJiv_hQMFn03g"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  if (userInput.trim() !== '') {
    addMessage(userInput, 'user');
    botResponse(userInput); // Trigger a bot response based on the user's input
    document.getElementById('userInput').value = ''; // Clear the input
  }
}
function calculateTemperatureStats(forecastData) {
    let temperatures = forecastData.map(entry => entry.main.temp); // Extract temperatures
    console.log(temperatures);
    const highestTemp = Math.max(...temperatures);
    const lowestTemp = Math.min(...temperatures);
    const avgTemp = (temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length);
    
    return {
      highestTemp,
      lowestTemp,
      avgTemp
    };
}


async function botResponse(userMessage) {
  let response = '';
  
     // Fetch weather data globally (assumed to be fetched and available as 'forecast')
    const { highestTemp, lowestTemp, avgTemp: averageTemp } = calculateTemperatureStats(forecastData);
 
     // Example bot response logic based on userMessage
     if (userMessage.toLowerCase().includes('hello')) {
         response = 'Hello! How can I assist you today?';
     } else if (userMessage.toLowerCase().includes('weather')) {
         response = 'You can check the weather forecast by entering your city name!';
     } else if (userMessage.toLowerCase().includes('highest temperature')) {
         response = `The highest temperature this week was ${highestTemp.toFixed(1)}°C.`;
     } else if (userMessage.toLowerCase().includes('lowest temperature')) {
         response = `The lowest temperature this week was ${lowestTemp.toFixed(1)}°C.`;
     } else if (userMessage.toLowerCase().includes('average temperature')) {
         response = `The average temperature this week is ${averageTemp.toFixed(1)}°C.`;
  } else {
    try {
        // Send request to the Generative API for other queries
        const newresponse = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userMessage }] }]
          }),
        });
    
        const data = await newresponse.json();
        if (!newresponse.ok) throw new Error(data.error.message);
    
        // Get and display the response
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\\(.?)\\*/g, '$1');
        response=apiResponse; // Show typing effect for API response
    
      } catch (error) {
        console.error("Error fetching bot response:", error);
           }
}

  // Simulate bot response after a delay
  setTimeout(() => {
    addMessage(response, 'bot');
  }, 300); // 300ms delay for a more natural response
}


// // async function fetchGoogleGeminiResponse(userMessage) {
// //     const apiKey = "AIzaSyA3WKYFSixfc2EBlva8rCmJiv_hQMFn03g";

// //     const geminiApiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}"; // Placeholder URL
    
// //     try {
// //         const response = await fetch(geminiApiUrl, {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //                 'Authorization': `Bearer ${apiKey}`
// //             },
// //             body: JSON.stringify({
// //                 query: userMessage,
// //                 model: 'gemini-chat',
// //                 session: 'unique-session-id'
// //             })
// //         });

// //         if (!response.ok) {
// //             console.error('Error fetching Google Gemini response');
// //             return null;
// //         }

// //         const data = await response.json();
// //         return data.response; // Return Gemini's response
// //     } catch (error) {
// //         console.error('Error:', error);
// //         return null;
// //     }
// // }
// // Function to analyze weather data
// function calculateTemperatureStats(forecastData) {
//     let temperatures = forecastData.list.map(entry => entry.main.temp); // Extract temperatures

//     const highestTemp = Math.max(...temperatures);
//     const lowestTemp = Math.min(...temperatures);
//     const avgTemp = (temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length).toFixed(2);

//     return {
//         highestTemp,
//         lowestTemp,
//         avgTemp
//     };
// }

function addMessage(message, sender) {
    const chatBody = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${sender}-message`);

    if (sender === 'bot') {
        simulateTypingEffect(message, messageDiv); // Call the typing effect function for bot responses
    } else {
        messageDiv.textContent = message;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
    }
}

// Function to simulate typing effect for bot responses
function simulateTypingEffect(message, element) {
    const chatBody = document.getElementById('chatBody');
    let index = 0;

    // Typing effect using setInterval
    const typingInterval = setInterval(() => {
        if (index < message.length) {
            element.textContent += message.charAt(index);
            index++;
            chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom as it types
        } else {
            clearInterval(typingInterval); // Stop the interval once typing is done
        }
    }, 50); // Typing speed (50ms per character)

    chatBody.appendChild(element);
    chatBody.scrollTop = chatBody.scrollHeight; // Ensure scroll stays at the bottom
}


//chatbot section end----------------------------------------------------------------------------------


let isCelsius = true; // Global variable to store the temperature unit (Celsius/Fahrenheit)
// Celsius/Fahrenheit Temperature Toggle
// -------------------------------------
// Function to update the temperature display between Celsius and Fahrenheit
function checkunit() {
  const isFahrenheit = document.getElementById('cb3-8').checked;
  
  if (isFahrenheit) {
    isCelsius = false;
    document.getElementById('temperature').textContent = 'Temperature (°F)'; // Update to Fahrenheit
  } else {
    isCelsius = true;
    document.getElementById('temperature').textContent = 'Temperature (°C)'; // Update to Celsius
  }
  displayWeatherDataTable();

}

// Event listener for temperature unit toggle
document.getElementById('cb3-8').addEventListener('change', checkunit);





async function fetchFiveDayWeatherForecastfortable(city) {
    const apiKey = '25b867c436580460135dbf82395c0973'; // Replace with your actual OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
       console.assert;
      }
      const data = await response.json();
      console.log(data);
      forecastData = data.list; // Store the forecast data globally
      filteredData = [...forecastData];
      // Calculate the total number of pages
      totalPages = Math.ceil(forecastData.length / entriesPerPage);
      displayWeatherDataTable();
     
      return data; // Return the JSON response
    } catch (error) {
      console.error('Error fetching 5-day weather forecast:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  }
// Function to fetch 5-day weather forecast data based on latitude and longitude input
async function fetchFiveDayWeatherForecast(latitude, longitude) {
    const apiKey = '25b867c436580460135dbf82395c0973'; // Replace with your actual OpenWeather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data); // Log the response data for debugging
      forecastData = data.list; // Store the forecast data globally
      filteredData = [...forecastData];
      // Calculate the total number of pages
      totalPages = Math.ceil(forecastData.length / entriesPerPage);
      displayWeatherDataTable();
     
   return data; // Return the JSON response
    } catch (error) {
      console.error('Error fetching 5-day weather forecast:', error);
      throw error; // Rethrow the error for further handling if needed
    }
  }





// //table section start----------------------------------------------------------------------------------
let currentPage = 1;
const entriesPerPage = 10;
let totalPages = 0;
let forecastData = [];
let filteredData = []; // Filtered data for the table
function displayWeatherDataTable() {
    const tableBody = document.getElementById('tableBody'); // Ensure tableBody is defined here
    tableBody.innerHTML = ''; // Clear existing table data
  
    // Calculate start and end index for the current page
    const start = (currentPage - 1) * entriesPerPage;
    const end = start + entriesPerPage;
    
    // Slice the forecast data for the current page
    const currentData = filteredData.slice(start, end);
     
    // Iterate over the current data and populate the table
    currentData.forEach(entry => {
        const row = document.createElement('tr');
        const date = new Date(entry.dt * 1000); // Convert UNIX timestamp to Date object
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // Data to display in the row
        const rowData = [
            date.toLocaleDateString(),
            date.toLocaleString('en-US', { weekday: 'long' }), // Day of the week
            time,
            isCelsius ? entry.main.temp.toFixed(1) : ((entry.main.temp * 9/5) + 32).toFixed(1), // Max temperature
            entry.weather[0].description,  // Weather condition (description)
        ];
  
        // Create table cells for each piece of data
        rowData.forEach(data => {
            const td = document.createElement('td');
            td.textContent = data;
            row.appendChild(td);
        });
  
        // Append the row to the table body
        tableBody.appendChild(row); // Use tableBody instead of tbody
    });
    updatePageInfo();
  }
  
// Update the pagination info
function updatePageInfo() {
  const pageInfo = document.getElementById('currentPage');
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
  
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Handle previous page button
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayWeatherDataTable(); // Refill table with data for the new page
    }
}

// Handle next page button
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        displayWeatherDataTable(); // Refill table with data for the new page
    }
}

// Attach event listeners to pagination buttons
document.getElementById('prevPage').addEventListener('click', prevPage);
document.getElementById('nextPage').addEventListener('click', nextPage);

  
// //table section end------------------------------------------------------------------------------------



// Function to get user's location and fetch weather data
function getUserLocationAndFetchWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          
          fetchFiveDayWeatherForecast(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          
          alert('Unable to retrieve your location. Please enter the city name.');
        }
      );
    } else {
     
      alert('Geolocation is not supported by this browser. Please enter the city name.');
    }
  }
  getUserLocationAndFetchWeather();
fetchFiveDayWeatherForecastfortable('london') ;

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

//////////////////////////

// Event listener for filter dropdown
document.getElementById('filter-select').addEventListener('change', (e) => {
    const filterValue = e.target.value;
    applyFilter(filterValue); // Apply the selected filter
  });
  // Function to apply filters
  function applyFilter(filter) {
    switch (filter) {
      case "asc":
        filteredData = [...forecastData].sort((a, b) => a.main.temp - b.main.temp);
        break;
      case "desc":
        filteredData = [...forecastData].sort((a, b) => b.main.temp - a.main.temp);
        break;
      case "rain":
        filteredData = forecastData.filter(entry => entry.weather[0].description.toLowerCase().includes("rain"));
        break;
      case "highest":
        const highestTempEntry = forecastData.reduce((prev, current) => 
          (prev.main.temp > current.main.temp) ? prev : current
        );
        filteredData = [highestTempEntry]; // Show only the highest temperature entry
        break;
      case "reset":
        filteredData = [...forecastData]; // Reset to original data
        break;
      default:
        filteredData = [...forecastData]; // No filter
    }
  
    currentPage = 1; // Reset to first page
    totalPages = Math.ceil(filteredData.length / entriesPerPage); // Recalculate total pages
    displayWeatherDataTable(); // Refill table with the filtered data
    }  