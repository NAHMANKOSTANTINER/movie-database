const API_KEY = "92af23ba89d9abce5489d233dfc4b248";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("movieDetails");

async function loadMovie() {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=he-IL&append_to_response=credits`);
  const m = await res.json();

  const actors = m.credits.cast.slice(0,5).map(a => a.name).join(", ");

  container.innerHTML = `
    <div class="row g-3">
      <div class="col-md-4">
        <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" class="img-fluid rounded" alt="${m.title}">
      </div>
      <div class="col-md-8 d-flex flex-column">
        <h2>${m.title}</h2>
        <p>${m.overview}</p>
        <p>⭐ דירוג: ${m.vote_average}</p>
        <p>🎭 ז’אנרים: ${m.genres.map(g => g.name).join(", ")}</p>
        <p>שחקנים: ${actors}</p>
        <div class="mt-auto d-flex gap-2 flex-wrap">
          <a href="index.html" class="btn btn-secondary">חזרה</a>
          <a href="favorites.html" class="btn btn-outline-danger">❤️ מועדפים</a>
          <button class="btn btn-danger" onclick='addToFavorites(${JSON.stringify(m).replace(/"/g,"&quot;")})'>הוסף למועדפים</button>
        </div>
      </div>
    </div>
  `;
}

function addToFavorites(movie) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.some(f => f.id === movie.id)) favs.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favs));
}

loadMovie();
