import { fetchPopularMovies, fetchAllMoviesByQuery } from './API.js';

let currentPage = 1;
let totalPages = 1;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzYzODM3NTM0ZTA1MjgxMTUzZTY3N2M4ODJmNjQ3OSIsIm5iZiI6MTczNjI5NTY2OS44MDA5OTk5LCJzdWIiOiI2NzdkYzRmNTIxOGZkNTdhY2Y0ZTRlNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hph74eopL8GQ7etWGx2M4uQuxX06aj36B-NgJQxN2dE'
    }
};

// 화면에 카드 출력하기 
const displayMovies = async (page) => {
    try {
        const movies = await fetchPopularMovies(page);
        const movieList = document.getElementById('movie-list');
        movieList.innerHTML = "";

        // 데이터를 로컬 스토리지에 저장
        localStorage.setItem('currentMovies', JSON.stringify(movies.results));

        movies.results.forEach(movie => {
            const card = document.createElement('div');
            card.className = "movieCard";
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
                <p>${movie.title}</p>
                <p>${movie.release_date}</p>
            `;
            movieList.appendChild(card);
        });
    } catch (error) {
        console.error('Error displaying movies:', error);
    }
};


displayMovies();


function displaySearchedMovies(movies) {
    const movieList = document.getElementById('movie-list');
    // 기존 목록을 지우고 새로 그리기
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const { title, release_date, poster_path } = movie;

        const card = document.createElement('div');
        card.className = 'movieCard';
        card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${title} Poster" id = "modal-btn" >
        <p>${title}</p>
        <p>${release_date ?? '개봉일 미정'}</p>
        `;

        movieList.appendChild(card);
    });
}


async function searchFnc() {
    const query = document.getElementById('search-text').value.trim().toLowerCase();
    // ID를 이용해 검색어 값을 query에 저장한다.
    if (!query) {
        alert('검색어를 입력해주세요!');
        return;
    }
    // 검색어를 입력하지 않고 클릭 할 경우 오류 메시지 출력 

    try {

        // 검색어가 포함된 모든 페이지를 가져옴
        const movies = await fetchAllMoviesByQuery(query);
        // 화면에 표시
        displaySearchedMovies(movies);


    } catch (error) {
        console.error(error);
    }
}

const searchBtn = document.getElementById('search-btn').addEventListener('click', async () => {
    searchFnc();
});

const searchInput = document.getElementById('search-text');
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchFnc();
    }
});

// 이전페이지, 다음페이지 구현
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        console.log(currentPage);
        displayMovies(currentPage);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentPage++;
    console.log(currentPage);
    displayMovies(currentPage);
});

// modal 창 on-off  
document.getElementById('movie-list').addEventListener("click", function (e) {
    if (e.target.tagName !== "IMG") {
        e.stopPropagation(); // 이벤트 전파 중단
        return;
    }

    // 클릭한 카드의 데이터 가져오기
    const movieCard = e.target.closest('.movieCard');
    const movieIndex = Array.from(movieCard.parentElement.children).indexOf(movieCard);
    const movies = JSON.parse(localStorage.getItem('currentMovies')); // API 데이터를 로컬 스토리지에서 불러오기
    const selectedMovie = movies[movieIndex];

    if (selectedMovie) {
        // 모달 업데이트
        const modal = document.getElementById('modal');
        modal.querySelector('h1').innerText = selectedMovie.title;
        modal.querySelector('img').src = `https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`;
        modal.querySelector('#vote-average').innerText = selectedMovie.vote_average || 'N/A';
        modal.querySelector('#overview').innerText = selectedMovie.overview || 'No overview available.';
        modal.querySelector('#release-date').innerText = selectedMovie.release_date || 'Unknown release date';

        // 모달 보이기
        modal.style.display = "block";
    }
});

document.getElementById('modal-closebtn').addEventListener("click",function(){
    modal.style.display = "none";
})