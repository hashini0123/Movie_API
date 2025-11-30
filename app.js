const API_KEY = '564318ab';
const API_URL = 'https://www.omdbapi.com/';

const NEW_REVIEWS_DATA = [
    { 
        id: 'tt26556100', 
        poster: 'eternityre-672x281.jpg', 
        title: 'Eternity' 
    },
    { 
        id: 'tt15096530',
        poster: 'silyanre-672x281.jpg', 
        title: 'Silyan' 
    }, 
    { 
        id: 'tt29547535',
        poster: 'hamnetre-672x281.jpg', 
        title: 'Hamnet' 
    }, 
    { 
        id: 'tt14270176',
        poster: 'teenagewastelandre-672x281.jpg', 
        title: 'Teenage Wasteland (1996)' 
    },
    { 
        id: 'tt13009664', 
        poster: 'stringerre-672x281.jpg', 
        title: 'Stringer' 
    },
    { 
        id: 'tt19005952', 
        poster: 'Zootopia-2025-1-jpg.webp', 
        title: 'Zootopia 2' 
    },
    { 
        id: 'tt20084518', 
        poster: 'wake-up-dead-man-2025-672x281.jpg', 
        title: 'Wake Up Dead Man (2025)' 
    },
    { 
        id: 'tt28014498', 
        poster: 'thingwithfeathersre-672x281.jpg', 
        title: 'Thing with Feathers' 
    },
    { 
        id: 'tt27389145', 
        poster: 'blknwsre-672x281.jpg', 
        title: 'Black News' 
    }
];

window.onload = function() {
    
    renderNewReviews();
    
    fetchMovie('tt3896198'); 
};

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMovie();
    }
});

function renderNewReviews() {
    const gridContainer = document.getElementById('newReviewsGrid');
    let htmlContent = '';

    NEW_REVIEWS_DATA.forEach(movie => {
        htmlContent += `
            <div class="new-review-card" data-imdb-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title} Poster" onerror="this.src='https://via.placeholder.com/672x281?text=Image+Missing'">
                <div class="review-title">${movie.title}</div>
            </div>
        `;
    });

    gridContainer.innerHTML = htmlContent;

    gridContainer.addEventListener('click', handleReviewClick);
}

function handleReviewClick(event) {
    const clickedCard = event.target.closest('.new-review-card');

    if (clickedCard) {
        const imdbID = clickedCard.getAttribute('data-imdb-id');
        
        if (imdbID) {
            document.getElementById('searchInput').value = ''; 
            fetchMovie(imdbID); 
        }
    }
}

function searchMovie() {
    const searchValue = document.getElementById('searchInput').value.trim();
    if (searchValue) {
        fetchMovie(searchValue);
    } else {
        showError('Please enter a movie title or IMDb ID');
    }
}

function fetchMovie(query) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('movieContent');
    const errorDiv = document.getElementById('error');

    loading.style.display = 'block';
    content.innerHTML = '';
    errorDiv.style.display = 'none';

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const param = query.startsWith('tt') ? `i=${query}` : `t=${encodeURIComponent(query)}`;
    const apiUrl = `${API_URL}?${param}&apikey=${API_KEY}`;

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch(apiUrl, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            loading.style.display = 'none';
            const data = JSON.parse(result);
            
            console.log('API Response:', data); 
            
            if (data.Response === 'True') {
                displayMovie(data);
            } else {
                showError(data.Error || 'Movie not found');
            }
        })
        .catch((error) => {
            loading.style.display = 'none';
            showError('Failed to fetch movie data. Please try again.');
            console.error('Error:', error);
        });
}

function displayMovie(movie) {
    const content = document.getElementById('movieContent');
    
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster+Available';

    let ratingsHTML = '';
    if (movie.Ratings && movie.Ratings.length > 0) {
        ratingsHTML = movie.Ratings.map(rating => `
            <div class="rating-box">
                <div class="rating-source">${rating.Source}</div>
                <div class="rating-value">${rating.Value}</div>
            </div>
        `).join('');
    } else {
        ratingsHTML = '<div class="rating-box"><div class="rating-source">No Ratings</div><div class="rating-value">N/A</div></div>';
    }

    content.innerHTML = `
        <div class="movie-card">
            <div class="poster-section">
                <img src="${posterUrl}" alt="${movie.Title}" onerror="this.src='https://via.placeholder.com/300x450?text=Image+Not+Available'">
            </div>
            <div class="info-section">
                <h2 class="movie-title">${movie.Title}</h2>
                <div class="movie-meta">
                    <span>📅 ${movie.Year}</span>
                    <span>⏱️ ${movie.Runtime}</span>
                    <span>🎭 ${movie.Rated}</span>
                </div>

                <div class="rating-section">
                    ${ratingsHTML}
                </div>

                <p class="movie-plot">${movie.Plot}</p>

                <div class="movie-details">
                    <div class="detail-item">
                        <span class="detail-label">Genre:</span>
                        <span class="detail-value">${movie.Genre}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Director:</span>
                        <span class="detail-value">${movie.Director}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Writer:</span>
                        <span class="detail-value">${movie.Writer}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Actors:</span>
                        <span class="detail-value">${movie.Actors}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Language:</span>
                        <span class="detail-value">${movie.Language}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Country:</span>
                        <span class="detail-value">${movie.Country}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Awards:</span>
                        <span class="detail-value">${movie.Awards}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Box Office:</span>
                        <span class="detail-value">${movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">IMDb Rating:</span>
                        <span class="detail-value">⭐ ${movie.imdbRating}/10 (${movie.imdbVotes} votes)</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Released:</span>
                        <span class="detail-value">${movie.Released}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}