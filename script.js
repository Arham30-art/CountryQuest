// Theme handling
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
} else {
  document.body.classList.remove('dark');
}

const countriesContainer = document.querySelector('.countries-container');
const filterByRegion = document.querySelector('.filter-by-region');
const searchInput = document.querySelector('.search-container input');
const themeChanger = document.querySelector('.theme-changer');

let allCountriesData = [];
let currentFilteredData = [];

// Fetch all countries
fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital')
  .then((res) => res.json())
  .then((data) => {
    allCountriesData = data;
    currentFilteredData = data;
    renderCountries(data);
  })
  .catch((err) => {
    console.error("Error fetching countries:", err);
    countriesContainer.innerHTML = "<p style='text-align:center; font-size:1.2rem;'>❌ Failed to load country data.</p>";
  });

// Render function
function renderCountries(data) {
  countriesContainer.innerHTML = '';

  if (data.length === 0) {
    countriesContainer.innerHTML = `<p style="font-size: 1.2rem; text-align: center; margin-top: 2rem;">😕 No countries found.</p>`;
    return;
  }

  data.forEach((country) => {
    const countryCard = document.createElement('a');
    countryCard.classList.add('country-card');
    countryCard.href = `/country.html?name=${country.name.common}`;
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <div class="card-text">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0] || 'N/A'}</p>
      </div>
    `;
    countriesContainer.appendChild(countryCard);
  });
}

// Region filter
filterByRegion.addEventListener('change', () => {
  const selectedRegion = filterByRegion.value;

  if (!selectedRegion) {
    currentFilteredData = allCountriesData;
  } else {
    currentFilteredData = allCountriesData.filter(c => c.region === selectedRegion);
  }

  // Apply search on filtered data
  const searchQuery = searchInput.value.toLowerCase();
  const finalResults = currentFilteredData.filter(c =>
    c.name.common.toLowerCase().includes(searchQuery)
  );

  renderCountries(finalResults);
});

// Search input
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();

  const filteredCountries = currentFilteredData.filter((country) =>
    country.name.common.toLowerCase().includes(query)
  );

  renderCountries(filteredCountries);
});

// Theme toggle
themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
