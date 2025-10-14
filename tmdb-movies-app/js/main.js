const API_KEY = "92af23ba89d9abce5489d233dfc4b248";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const container = document.getElementById("moviesContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const movieDetails = document.getElementById("movieDetails");
const genreSelect = document.getElementById("genreSelect");
const yearInput = document.getElementById("yearInput");
const sortSelect = document.getElementById("sortSelect");

let currentMovies = [], genresMap = {};

// טעינת ז'אנרים
async function loadGenres() {
    const data = await (await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=he-IL`)).json();
    data.genres.forEach(g => genresMap[g.id] = g.name);
    genreSelect?.append(...data.genres.map(g => Object.assign(document.createElement("option"), {value:g.id, textContent:g.name})));
}
loadGenres();

// מועדפים
function addToFavorites(m) {
    if(!m.id) return;
    let favs = JSON.parse(localStorage.getItem("favorites"))||[];
    if(!favs.some(f=>f.id===m.id)) {favs.push(m); localStorage.setItem("favorites", JSON.stringify(favs)); renderFavorites();}
}
function renderFavorites() {
    if(!favoritesContainer) return;
    const favs = JSON.parse(localStorage.getItem("favorites"))||[];
    favoritesContainer.innerHTML = favs.map(m => {
        const g = (m.genre_ids||[]).map(id=>genresMap[id]).filter(Boolean).join(", ");
        return `<div class="card m-2 col-sm-6 col-md-4 col-lg-3" data-id="${m.id}">
            <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" class="card-img-top">
            <div class="card-body text-end">
                <h6>${m.title}</h6><p>⭐ ${m.vote_average}</p><p>ז'אנרים: ${g}</p><p>שנה: ${m.release_date?.slice(0,4)||"לא ידוע"}</p>
                <a href="movie.html?id=${m.id}" class="btn btn-sm btn-outline-primary mb-1">פרטים</a>
                <button class="btn btn-sm btn-danger remove-fav">🗑️</button>
            </div>
        </div>`;
    }).join("");
    document.querySelectorAll(".remove-fav").forEach(b=>{
        b.onclick=()=>{let id=+b.closest(".card").dataset.id; let f=JSON.parse(localStorage.getItem("favorites"))||[]; f=f.filter(x=>x.id!==id); localStorage.setItem("favorites",JSON.stringify(f)); renderFavorites();}
    });
}

// הצגת סרטים
function renderMovies(movies) {
    if(!container) return;
    container.innerHTML = movies.map(m=>{
        const g=(m.genre_ids||[]).map(id=>genresMap[id]).filter(Boolean).join(", ");
        return `<div class="card m-2 col-sm-6 col-md-4 col-lg-3" data-id="${m.id}">
            <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" class="card-img-top">
            <div class="card-body text-end">
                <h6>${m.title}</h6><p>⭐ ${m.vote_average}</p><p>ז'אנרים: ${g}</p><p>שנה: ${m.release_date?.slice(0,4)||"לא ידוע"}</p>
                <a href="movie.html?id=${m.id}" class="btn btn-sm btn-outline-primary mb-1">פרטים</a>
                <button class="btn btn-sm btn-danger add-fav">❤️ הוספה למועדפים </button>
            </div>
        </div>`;
    }).join("");
    document.querySelectorAll(".add-fav").forEach(b=>{
        b.onclick=()=>{const id=+b.closest(".card").dataset.id; const m=currentMovies.find(x=>x.id===id); addToFavorites(m);}
    });
}

// פרטי סרט
async function loadMovieDetails() {
    if(!movieDetails) return;
    const id = new URLSearchParams(window.location.search).get("id");
    if(!id) return;

    const m = await (await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=he-IL`)).json();
    currentMovies = [m];

    const g = (m.genres||[]).map(x=>x.name).join(", ");

    movieDetails.innerHTML = `<div class="row">
        <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" class="img-fluid">
        </div>
        <div class="col-md-8 text-end">
            <h2>${m.title}</h2>
            <p>⭐ ${m.vote_average}</p>
            <p>ז'אנרים: ${g}</p>
            <p>${m.overview||"אין תיאור"}</p>
            <p>שנה: ${m.release_date?.slice(0,4)||"לא ידוע"}</p>
        </div>
    </div>`;
}



// חיפוש
searchBtn?.addEventListener("click", async ()=>{
    const q=searchInput.value.trim(), g=genreSelect.value, y=yearInput.value, s=sortSelect.value;
    if(q && q.length<3){alert("יש להקליד לפחות 3 תווים"); return;}
    let url=q?`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=he-IL&query=${encodeURIComponent(q)}`:
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=he-IL&sort_by=${s}${g?`&with_genres=${g}`:""}${y?`&primary_release_year=${y}`:""}`;
    const data=await (await fetch(url)).json();
    currentMovies=data.results.filter(x=>x.poster_path);
    renderMovies(currentMovies);
    localStorage.setItem("lastSearchResults",JSON.stringify(currentMovies));
});

// טעינת דף
window.addEventListener("DOMContentLoaded", async ()=>{
    await loadGenres();
    const last=localStorage.getItem("lastSearchResults");
    if(last){currentMovies=JSON.parse(last); renderMovies(currentMovies);}
    renderFavorites();
    loadMovieDetails();
});
