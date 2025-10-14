const favContainer = document.getElementById("favoritesContainer");
const searchFav = document.getElementById("favSearch");
const clearAll = document.getElementById("clearAll");

// הצגת רשימת המועדפים
function renderFavorites(filter = "") {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (filter) favs = favs.filter(f => f.title.includes(filter));

  favContainer.innerHTML = favs.map(f => `
    <div class="col-6 col-sm-4 col-md-3">
      <div class="card h-100 shadow-sm">
        <img src="https://image.tmdb.org/t/p/w500${f.poster_path}" class="card-img-top" alt="${f.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${f.title}</h6>
          <div class="mt-auto d-flex justify-content-between">
            <a href="movie.html?id=${f.id}" class="btn btn-sm btn-outline-primary">פרטים</a>
            <button class="btn btn-sm btn-outline-danger" onclick="removeFavorite(${f.id})">🗑 הסר</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// הסרה של סרט ספציפי
function removeFavorite(id) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favs = favs.filter(f => f.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favs));
  renderFavorites();
}

// מחיקה של כל המועדפים
clearAll.addEventListener("click", () => {
  localStorage.removeItem("favorites");
  renderFavorites();
});

// חיפוש במועדפים
searchFav.addEventListener("input", e => renderFavorites(e.target.value));

// הפעלה ראשונית
renderFavorites();
