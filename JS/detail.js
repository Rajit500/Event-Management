// GET EVENT ID FROM URL
function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// LOAD EVENT DETAILS
function loadEventDetail() {
    const id = getIdFromURL();
    const event = getEventById(id);

    if (!event) {
        document.getElementById('eventDetail').innerHTML = `
            <p style="color:var(--text-light)">Event not found!</p>`;
        return;
    }

    const filled = event.filledSeats;
    const total = event.totalSeats;
    const percent = Math.round((filled / total) * 100);
    const isFull = filled >= total;
    const isBookmarked = getBookmarks().includes(event.id);

    document.getElementById('eventDetail').innerHTML = `

        <!-- EVENT IMAGE -->
        <img src="${event.image}" alt="${event.title}"
             onerror="this.src='https://via.placeholder.com/800x300?text=Event'"
             style="width:100%; height:300px; object-fit:cover;
                    border-radius:12px; margin-bottom:25px;">

        <!-- TITLE ROW -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div>
                <span class="badge ${event.category}">${event.category}</span>
                <h1 style="font-size:26px; font-weight:700; margin-top:8px;">
                    ${event.title}
                </h1>
            </div>
            <button class="bookmark-btn" id="bookmarkBtn"
                onclick="toggleBookmarkDetail(${event.id})">
                ${isBookmarked ? '🔖' : '🤍'}
            </button>
        </div>

        <!-- EVENT INFO -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:25px;">
            <div class="card" style="padding:15px;">
                <p style="font-size:13px; color:var(--text-light);">📅 Event Date</p>
                <p style="font-weight:600;">${formatDate(event.date)}</p>
            </div>
            <div class="card" style="padding:15px;">
                <p style="font-size:13px; color:var(--text-light);">📍 Venue</p>
                <p style="font-weight:600;">${event.venue}</p>
            </div>
            <div class="card" style="padding:15px;">
                <p style="font-size:13px; color:var(--text-light);">👤 Organizer</p>
                <p style="font-weight:600;">${event.organizer}</p>
            </div>
            <div class="card" style="padding:15px;">
                <p style="font-size:13px; color:var(--text-light);">🏷️ Category</p>
                <p style="font-weight:600;">${event.category}</p>
            </div>
        </div>

        <!-- DESCRIPTION -->
        <h3 style="font-size:18px; font-weight:600; margin-bottom:10px;">About this Event</h3>
        <p style="font-size:14px; color:var(--text-light); 
                  line-height:1.8; margin-bottom:25px;">
            ${event.description}
        </p>

        <!-- COUNTDOWN TIMER -->
        <h3 style="font-size:18px; font-weight:600; margin-bottom:10px;">
            ⏳ Registration Closes In
        </h3>
        <div class="countdown" id="countdown"></div>

        <!-- SEAT COUNTER -->
        <h3 style="font-size:18px; font-weight:600; 
                   margin-top:25px; margin-bottom:10px;">
            🪑 Seat Availability
        </h3>
        <div class="seat-bar">
            <div class="seat-bar-fill" style="width:${percent}%"></div>
        </div>
        <p class="seat-text" style="margin-top:5px;">
            ${filled} out of ${total} seats filled
        </p>
        
        <!-- TIME -->
        <div class="card" style="padding:15px;">
            <p style="font-size:13px; color:var(--text-light);">⏰ Event Time</p>
            <p style="font-weight:600;">${event.time || 'TBA'}</p>
        </div>

        <!-- PRIZE -->
        <div class="card" style="padding:15px;">
             <p style="font-size:13px; color:var(--text-light);">🏆 Prize</p>
             <p style="font-weight:600;">${event.prize || 'Certificate of Participation'}</p>
        </div>

        <!-- CONTACT -->
        <div class="card" style="padding:15px;">
            <p style="font-size:13px; color:var(--text-light);">📞 Contact</p>
         <p style="font-weight:600;">${event.contact || event.organizer}</p>
        </div>

        <!-- EVENT TYPE -->
        <div class="card" style="padding:15px;">
                        <p style="font-size:13px; color:var(--text-light);">🏫 Event Type</p>
            <p style="font-weight:600;">
        ${event.eventType === 'inter' ? '🌐 Inter College' : '🏫 Intra College'}
         </p>
        </div>

        <!-- REGISTER BUTTON -->
        <div style="margin-top:25px;">
            ${isFull
                ? `<button class="btn btn-outline" disabled
                     style="opacity:0.5; cursor:not-allowed; width:100%;">
                     Seats Full ❌</button>`
                : `<a href="register.html?id=${event.id}"
                     class="btn btn-primary" style="width:100%;
                     text-align:center; display:block;">
                     Register Now 🎉</a>`
            }
        </div>
    `;

    // START COUNTDOWN
    startCountdown(event.registrationDeadline);
}

// FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// BOOKMARK FUNCTIONS
function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

function toggleBookmarkDetail(id) {
    let bookmarks = getBookmarks();
    const btn = document.getElementById('bookmarkBtn');
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(b => b !== id);
        btn.textContent = '🤍';
    } else {
        bookmarks.push(id);
        btn.textContent = '🔖';
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// RUN ON PAGE LOAD
document.addEventListener('DOMContentLoaded', loadEventDetail);