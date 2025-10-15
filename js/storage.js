function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(list) {
    localStorage.setItem("favorites", JSON.stringify(list));
}

function addToFavorites(movie) {
    const favs = getFavorites();
    if (!favs.find(m => m.id === movie.id)) {
        favs.push(movie);
        saveFavorites(favs);
    }
}

function removeFromFavorites(id) {
    const favs = getFavorites().filter(m => m.id !== id);
    saveFavorites(favs);
}

function isFavorite(id) {
    return getFavorites().some(m => m.id === id);
}
