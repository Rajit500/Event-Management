// GET BOOKMARKS FROM LOCALSTORAGE
function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

// FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// LOAD BOOKMARKED EVENTS
function loadBookmarks() {
    const grid = document.getElementById('bookmarksGrid');
    const bookmarks = getBookmarks();
    const allEvents = getEvents();

    // FILTER ONLY BOOKMARKED EVENTS
    const bookmarkedEvents = allEvents.filter(e => bookmarks.includes(e.id));

    // IF NO BOOKMARKS
    if (bookmarkedEvents.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center; padding:50px; 
                        color:var(--text-light); grid-column: 1/-1;">
                <div style="font-size:60px; margin-bottom:15px;">🔖</div>
                <h3 style="font-size:18px; margin-bottom:10px;">
                    No Bookmarks Yet!
                </h3>
                <p style="font-size:14px;">
                    Go to home page and bookmark events you like.
                </p>
                <a href="index.html" class="btn btn-primary" 
                   style="margin-top:20px; display:inline-block;">
                   Browse Events
                </a>
            </div>`;
        return;
    }

    // SHOW BOOKMARKED EVENTS
    grid.innerHTML = bookmarkedEvents.map(event => {
        const filled = event.filledSeats;
        const total = event.totalSeats;
        const percent = Math.round((filled / total) * 100);
        const isFull = filled >= total;

        return `
        <div class="card event-card">
            <img src="${event.image}" alt="${event.title}"
                 onerror="this.src='https://via.placeholder.com/400x160?text=Event'">
            <div class="card-body">

                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="badge ${event.category}">${event.category}</span>
                    <button class="bookmark-btn" 
                        onclick="removeBookmark(${event.id}, this)"
                        title="Remove Bookmark">
                        🔖
                    </button>
                </div>

                <h3 class="card-title">${event.title}</h3>
                <p class="card-text">${event.description.substring(0, 80)}...</p>

                <p class="seat-text">📅 ${formatDate(event.date)}</p>
                <p class="seat-text">📍 ${event.venue}</p>

                <!-- SEAT BAR -->
                <div class="seat-bar" style="margin-top:10px;">
                    <div class="seat-bar-fill" style="width:${percent}%"></div>
                </div>
                <p class="seat-text">${filled}/${total} seats filled</p>

                <div style="margin-top:12px; display:flex; gap:10px;">
                    ${isFull
                        ? `<button class="btn btn-outline" disabled
                             style="opacity:0.5; cursor:not-allowed;">
                             Seats Full</button>`
                        : `<a href="event-detail.html?id=${event.id}"
                             class="btn btn-primary">View Details</a>`
                    }
                </div>

            </div>
        </div>`;
    }).join('');
}

// REMOVE BOOKMARK
function removeBookmark(id, btn) {
    let bookmarks = getBookmarks();
    bookmarks = bookmarks.filter(b => b !== id);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // RELOAD PAGE TO REFLECT CHANGES
    loadBookmarks();
}

// RUN ON PAGE LOAD
document.addEventListener('DOMContentLoaded', loadBookmarks);