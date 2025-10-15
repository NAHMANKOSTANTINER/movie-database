const container = document.getElementById("moviesContainer");
const API_KEY = "92af23ba89d9abce5489d233dfc4b248"; // הכנס את ה-API Key שלך

async function fetchTrending() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=he`);
    const data = await response.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    container.innerHTML = "";
    movies.forEach(movie => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        col.innerHTML = `
        <div class="card h-100 shadow-sm">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${movie.title}</h5>
                <p class="text-muted">${movie.release_date?.slice(0,4) || "לא ידוע"}</p>
                <p>⭐ ${movie.vote_average}</p>
                <a href="movie.html?id=${movie.id}" class="btn btn-sm btn-outline-primary mt-auto">פרטים</a>
                <button class="btn btn-sm btn-outline-danger mt-2" onclick="addToFavorites(${JSON.stringify(movie).replace(/"/g,'&quot;')})">❤️ למועדפים</button>
            </div>
        </div>
        `;
        container.appendChild(col);
    });
}

// הפעלת הפונקציה כשנטען הדף
window.addEventListener("DOMContentLoaded", fetchTrending);
