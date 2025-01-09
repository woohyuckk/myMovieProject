import { fetchPopularMovies } from './API.js';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzYzODM3NTM0ZTA1MjgxMTUzZTY3N2M4ODJmNjQ3OSIsIm5iZiI6MTczNjI5NTY2OS44MDA5OTk5LCJzdWIiOiI2NzdkYzRmNTIxOGZkNTdhY2Y0ZTRlNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hph74eopL8GQ7etWGx2M4uQuxX06aj36B-NgJQxN2dE'
    }
};

const displayMovies = async () => {
    try {
        const movies = await fetchPopularMovies();
        const movieList = document.getElementById('movie-list');

        movies.results.forEach(movie => {
            const listItem = document.createElement('div');
            listItem.innerHTML = `<div class="movieCard">
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
            <p>${movie.title}</p>
            <p>${movie.release_date}</p>
            </div>`;
            movieList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error displaying movies:', error);
    }
};
displayMovies();

