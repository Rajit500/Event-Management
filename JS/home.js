let currentFilter = 'All';
let currentType = 'All';

// BUILD EVENT CARD
function buildEventCard(event, isPast) {
    const filled = event.filledSeats;
    const total = event.totalSeats;
    const percent = Math.round((filled / total) * 100);
    const isFull = filled >= total;
    const isBookmarked = getBookmarks().includes(event.id);

    return `
    <div class="card event-card" style="${isPast ? 'opacity:0.75;' : ''}">
        <div style="position:relative; overflow:hidden; height:180px;">
            <img src="${event.image}" alt="${event.title}"
                 style="width:100%; height:180px; object-fit:cover;"
                 onerror="this.src='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=180&fit=crop'">
            ${isPast ? `
                <div style="position:absolute; top:10px; right:10px;
                            background:rgba(0,0,0,0.75); color:white;
                            padding:4px 12px; border-radius:20px;
                            font-size:11px; font-weight:700;">
                    ✅ Event Ended
                </div>` : ''}
        </div>
        <div style="padding:16px;">
            <div style="display:flex; justify-content:space-between;
            align-items:center; margin-bottom:8px;">

    <!-- LEFT SIDE — BADGES -->
    <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">

        <!-- CATEGORY BADGE -->
        <span class="badge ${event.category}">
            ${event.category}
        </span>

        <!-- INTRA/INTER BADGE -->
        <span style="background:${event.eventType === 'inter'
                ? '#EFF6FF' : '#F0FDF4'};
                color:${event.eventType === 'inter'
                ? '#1D4ED8' : '#15803D'};
                padding:3px 8px; border-radius:20px;
                font-size:10px; font-weight:700;
                text-transform:uppercase;">
            ${event.eventType === 'inter' ? '🌐 Inter' : '🏫 Intra'}
        </span>

    </div>

    <!-- RIGHT SIDE — BOOKMARK BUTTON -->
    ${!isPast ? `
        <button class="bookmark-btn"
            onclick="toggleBookmark(${event.id}, this)">
            ${isBookmarked ? '🔖' : '🤍'}
        </button>` : ''}

</div>
            <h3 style="font-size:16px; font-weight:700; margin-bottom:6px;
                       color:var(--text);">${event.title}</h3>
            <p style="font-size:13px; color:var(--text-light); 
                      margin-bottom:10px; line-height:1.5;">
                ${event.description.substring(0, 80)}...
            </p>
            <p style="font-size:12px; color:var(--text-light); margin-bottom:4px;">
                📅 ${formatDate(event.date)}
            </p>
            <p style="font-size:12px; color:var(--text-light); margin-bottom:10px;">
                📍 ${event.venue}
            </p>
            <div style="background:rgba(79,70,229,0.08); border-radius:10px;
                        height:6px; margin-bottom:6px; overflow:hidden;">
                <div style="width:${percent}%; height:100%; border-radius:10px;
                            background:linear-gradient(90deg, #4F46E5, #F43F5E);">
                </div>
            </div>
            <p style="font-size:12px; color:var(--text-light); margin-bottom:12px;">
                ${filled}/${total} seats filled
            </p>
            <div>
                ${isPast
                    ? `<button type="button" disabled
                         style="width:100%; padding:10px; border-radius:8px;
                                background:transparent; border:2px solid #e0e0e0;
                                color:var(--text-light); font-size:13px;
                                font-weight:600; cursor:not-allowed;">
                         Event Ended ✅</button>`
                    : isFull
                        ? `<button type="button" disabled
                             style="padding:10px 20px; border-radius:8px;
                                    background:transparent; border:2px solid #e0e0e0;
                                    color:var(--text-light); font-size:13px;
                                    font-weight:600; cursor:not-allowed;">
                             Seats Full ❌</button>`
                        : `<a href="event-detail.html?id=${event.id}"
                             style="display:inline-block; padding:10px 20px;
                                    border-radius:8px; font-size:13px; font-weight:600;
                                    background:linear-gradient(135deg, #4F46E5, #7C3AED);
                                    color:white; box-shadow:0 4px 15px rgba(79,70,229,0.3);">
                             View Details</a>`
                }
            </div>
        </div>
    </div>`;
}

// LOAD ALL EVENTS
function loadEvents(filter = 'All', search = '') {
    const grid = document.getElementById('eventsGrid');
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    let allEvents = getEvents();

    // SEPARATE UPCOMING AND PAST
    let upcomingEvents = allEvents.filter(e =>
        new Date(e.registrationDeadline) >= today
    );
    let pastEvents = allEvents.filter(e =>
        new Date(e.registrationDeadline) < today &&
        new Date(e.date) >= threeMonthsAgo
    );

    // APPLY CATEGORY FILTER
    if (filter !== 'All') {
        upcomingEvents = upcomingEvents.filter(e => e.category === filter);
        pastEvents = pastEvents.filter(e => e.category === filter);
    }

    // APPLY TYPE FILTER
    if (currentType !== 'All') {
        upcomingEvents = upcomingEvents.filter(e => e.eventType === currentType);
        pastEvents = pastEvents.filter(e => e.eventType === currentType);
}

    // APPLY SEARCH
    if (search !== '') {
        upcomingEvents = upcomingEvents.filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase())
        );
        pastEvents = pastEvents.filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    // NO EVENTS FOUND
    if (upcomingEvents.length === 0 && pastEvents.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px;">
                <p style="color:var(--text-light); font-size:15px;">
                    No events found 😕
                </p>
            </div>`;
        return;
    }

    // BUILD HTML
    let upcomingHTML = upcomingEvents.map(e => buildEventCard(e, false)).join('');
    let pastHTML = pastEvents.map(e => buildEventCard(e, true)).join('');

    grid.innerHTML = `
        ${upcomingEvents.length > 0 ? `
            <div style="grid-column:1/-1; margin-bottom:5px;">
                <h3 style="font-size:18px; font-weight:700; color:var(--text);">
                    🔥 Upcoming Events
                </h3>
            </div>
            ${upcomingHTML}` : ''}

        ${pastEvents.length > 0 ? `
            <div style="grid-column:1/-1; margin:15px 0 5px;">
                <h3 style="font-size:18px; font-weight:700;
                           color:var(--text-light);">
                    📅 Previous Events
                </h3>
            </div>
            ${pastHTML}` : ''}
    `;
}


// FILTER EVENTS
 function filterEvents(category) {
    currentFilter = category;
    currentType = 'All';

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === category) {
            btn.classList.add('active');
        }
    });

    loadEvents(currentFilter,
        document.getElementById('searchInput').value);
}

 // FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// BOOKMARKS
function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

function toggleBookmark(id, btn) {
    let bookmarks = getBookmarks();
    if (bookmarks.includes(id)) {
        bookmarks = bookmarks.filter(b => b !== id);
        btn.textContent = '🤍';
    } else {
        bookmarks.push(id);
        btn.textContent = '🔖';
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// FILTER BY EVENT TYPE
function filterByType(type) {
    currentType = type;
    currentFilter = 'All';

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes('Intra') && type === 'intra') {
            btn.classList.add('active');
        }
        if (btn.textContent.includes('Inter') && type === 'inter') {
            btn.classList.add('active');
        }
    });

    loadEvents(currentFilter,
        document.getElementById('searchInput').value);
} 

// HERO STATS
function loadHeroStats() {
    const allEvents = getEvents();
    const registrations = JSON.parse(
        localStorage.getItem('registrations') || '[]'
    );
    const heroEvents = document.getElementById('heroEvents');
    const heroReg = document.getElementById('heroRegistrations');
    if (heroEvents) heroEvents.textContent = allEvents.length;
    if (heroReg) heroReg.textContent = registrations.length;
}

// RUN ON PAGE LOAD
 document.addEventListener('DOMContentLoaded', async () => {
    // SHOW LOCALSTORAGE EVENTS FIRST
    loadEvents();
    loadHeroStats();

    // THEN FETCH FROM FIREBASE AND UPDATE
    try {
        if (typeof getEventsFromFirebase !== 'undefined') {
            const firebaseEvents = await getEventsFromFirebase();
            if (firebaseEvents.length > 0) {
                // ALWAYS USE FIREBASE DATA
                localStorage.setItem('events', 
                    JSON.stringify(firebaseEvents));
                loadEvents();
                loadHeroStats();
            }
        }
    } catch (error) {
        console.log('Using localStorage events');
    }

    document.getElementById('searchInput').addEventListener('input', (e) => {
        loadEvents(currentFilter, e.target.value);
    });
});