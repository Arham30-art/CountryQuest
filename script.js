
// Check and apply saved theme on page load
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

let allCountriesData;

// Fetch all countries using v3.1 with required 'fields' parameter
fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital')
  .then((res) => res.json())
  .then((data) => {
    renderCountries(data);
    allCountriesData = data;
  })
  .catch((err) => {
    console.error("Error fetching countries:", err);
    countriesContainer.innerHTML = "<p style='text-align:center; font-size:1.2rem;'>❌ Failed to load country data.</p>";
  });

// Filter by region
filterByRegion.addEventListener('change', (e) => {
  const region = filterByRegion.value;
  if (!region) return renderCountries(allCountriesData);

  fetch(`https://restcountries.com/v3.1/region/${region}?fields=name,flags,population,region,capital`)
    .then((res) => res.json())
    .then(renderCountries)
    .catch((err) => {
      console.error("Error filtering by region:", err);
      countriesContainer.innerHTML = "<p style='text-align:center; font-size:1.2rem;'>❌ Failed to load region data.</p>";
    });
});

// Render country cards
function renderCountries(data) {
  countriesContainer.innerHTML = '';
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

// Search input handler
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(query)
  );
  renderCountries(filteredCountries);
});

themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  
  // Save current theme in localStorage
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
