export const key = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzYzODM3NTM0ZTA1MjgxMTUzZTY3N2M4ODJmNjQ3OSIsIm5iZiI6MTczNjI5NTY2OS44MDA5OTk5LCJzdWIiOiI2NzdkYzRmNTIxOGZkNTdhY2Y0ZTRlNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hph74eopL8GQ7etWGx2M4uQuxX06aj36B-NgJQxN2dE'

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: key
    }
};

// Popular movie list 가져오기 

const fetchPopularMovies = async (page = 1) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}&region=KR`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data; // 반환값에 await 사용 가능
    } catch (error) {
        console.error('Failed to fetch popular movies:', error);
        throw error; // 호출자에게 에러를 전달
    }
};

fetchPopularMovies();

// search 전용 API 
async function fetchAllMoviesByQuery(query) {
    const allResults = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages && currentPage <= 300) {
        // TMDB가 최대 500페이지까지만 제공
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=ko-KR&page=${currentPage}&region=KR`;

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }

        const data = await response.json();
        totalPages = data.total_pages;      // 전체 페이지 수 업데이트
        allResults.push(...data.results);   // 결과들을 누적
        currentPage++;
    }

    return allResults; // 모든 페이지의 결과를 합쳐서 리턴
}

export { fetchPopularMovies, fetchAllMoviesByQuery};
