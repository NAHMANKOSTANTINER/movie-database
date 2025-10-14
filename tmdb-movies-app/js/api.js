const API_KEY = "92af23ba89d9abce5489d233dfc4b248";
const BASE_URL = "https://api.themoviedb.org/3";

async function searchMovies(query) {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=he-IL`);
    const data = await res.json();
    return data.results || [];
}

async function getMovieDetails(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=he-IL&append_to_response=credits`);
    return res.json();
}
