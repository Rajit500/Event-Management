 // CHECK IF ADMIN IS LOGGED IN
const currentAdmin = localStorage.getItem('currentAdmin');
if (!currentAdmin) {
    alert('Access denied! Please login as admin.');
    window.location.href = 'admin-login.html';
}

 // FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// SHOW TAB
function showTab(tabName, clickedBtn) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    clickedBtn.classList.add('active');

    if (tabName === 'manageEvents')      loadManageEvents();
    if (tabName === 'viewRegistrations') loadRegistrations();
    if (tabName === 'manageAnnouncements') loadManageAnnouncements();

}
 
// LOAD STATS
function loadStats() {
    const allEvents = getEvents();
    const registrations = JSON.parse(
        localStorage.getItem('registrations') || '[]'
    );
    const announcements = JSON.parse(
        localStorage.getItem('announcements') || '[]'
    );

    document.getElementById('totalEvents').textContent = allEvents.length;
    document.getElementById('totalRegistrations').textContent = registrations.length;
    document.getElementById('totalAnnouncements').textContent = announcements.length;
}

// ADD NEW EVENT
 async function addEvent() {
    const title       = document.getElementById('newTitle').value.trim();
    const category    = document.getElementById('newCategory').value;
    const eventType   = document.getElementById('newEventType').value;
    const description = document.getElementById('newDescription').value.trim();
    const date        = document.getElementById('newDate').value;
    const deadline    = document.getElementById('newDeadline').value;
    const time        = document.getElementById('newTime').value;
    const venue       = document.getElementById('newVenue').value.trim();
    const seats       = document.getElementById('newSeats').value;
    const organizer   = document.getElementById('newOrganizer').value.trim();
    const prize       = document.getElementById('newPrize').value.trim();
    const contact     = document.getElementById('newContact').value.trim();
    const image       = document.getElementById('newImage').value.trim();

    // VALIDATION — required fields only
    if (!title || !category || !eventType || !description || 
        !date || !deadline || !venue || !seats || !organizer) {
        document.getElementById('eventError').style.display = 'block';
        document.getElementById('eventSuccess').style.display = 'none';
        return;
    }

    // CREATE NEW EVENT
    const allEvents = getEvents();
    const newEvent = {
        id: Date.now(),
        title,
        category,
        eventType,
        description,
        date,
        registrationDeadline: deadline,
        time: time || 'TBA',
        venue,
        totalSeats: parseInt(seats),
        filledSeats: 0,
        organizer,
        prize: prize || 'Certificate of Participation',
        contact: contact || organizer,
        image: image ||
            `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=180&fit=crop`
    };

    // SAVE TO FIREBASE
    if (typeof addEventToFirebase !== 'undefined') {
        const firestoreId = await addEventToFirebase(newEvent);
        newEvent.firestoreId = firestoreId;
    }

    // SAVE TO LOCALSTORAGE
    allEvents.push(newEvent);
    localStorage.setItem('events', JSON.stringify(allEvents));

    // SHOW SUCCESS
    document.getElementById('eventError').style.display = 'none';
    document.getElementById('eventSuccess').style.display = 'block';

    // CLEAR FORM
    document.getElementById('newTitle').value = '';
    document.getElementById('newCategory').value = '';
    document.getElementById('newEventType').value = '';
    document.getElementById('newDescription').value = '';
    document.getElementById('newDate').value = '';
    document.getElementById('newDeadline').value = '';
    document.getElementById('newTime').value = '';
    document.getElementById('newVenue').value = '';
    document.getElementById('newSeats').value = '';
    document.getElementById('newOrganizer').value = '';
    document.getElementById('newPrize').value = '';
    document.getElementById('newContact').value = '';
    document.getElementById('newImage').value = '';

    // UPDATE STATS
    loadStats();
}


// LOAD MANAGE EVENTS
function loadManageEvents() {
    const list = document.getElementById('manageEventsList');
    const allEvents = getEvents();

    if (allEvents.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:50px; color:var(--text-light);">
                <div style="font-size:60px; margin-bottom:15px;">📋</div>
                <h3 style="font-size:18px;">No Events Found!</h3>
            </div>`;
        return;
    }

    list.innerHTML = allEvents.map(ev => `
        <div class="card" style="padding:20px; margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between;
                        align-items:center; gap:10px;">
                <div style="display:flex; gap:15px; align-items:center;">
                    <img src="${ev.image}" alt="${ev.title}"
                         onerror="this.src='https://via.placeholder.com/80x60?text=Event'"
                         style="width:80px; height:60px;
                                object-fit:cover; border-radius:8px;">
                    <div>
                        <span class="badge ${ev.category}">${ev.category}</span>
                        <h3 style="font-size:15px; font-weight:600; margin-top:4px;">
                            ${ev.title}
                        </h3>
                        <p style="font-size:12px; color:var(--text-light);">
                            📅 ${formatDate(ev.date)} |
                            🪑 ${ev.filledSeats}/${ev.totalSeats} seats
                        </p>
                    </div>
                </div>
                 <button type="button" onclick="deleteEvent(${ev.id}, '${ev.firestoreId}')"
                    style="background:#ff4757; color:white; border:none;
                           padding:8px 15px; border-radius:8px;
                           cursor:pointer; font-size:13px; font-weight:600;
                           white-space:nowrap;">
                    🗑️ Delete
                </button>
            </div>
        </div>`
    ).join('');
}

// DELETE EVENT
 async function deleteEvent(id, firestoreId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    // DELETE FROM FIREBASE
    if (firestoreId && typeof deleteEventFromFirebase !== 'undefined') {
        await deleteEventFromFirebase(firestoreId);
    }

    // DELETE FROM LOCALSTORAGE
    let allEvents = getEvents();
    allEvents = allEvents.filter(e => e.id !== id);
    localStorage.setItem('events', JSON.stringify(allEvents));

    loadManageEvents();
    loadStats();
}

// LOAD MANAGE ANNOUNCEMENTS
function loadManageAnnouncements() {
    const list = document.getElementById('manageAnnouncementsList');
    const announcements = JSON.parse(
        localStorage.getItem('announcements') || '[]'
    );

    if (announcements.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:50px; color:var(--text-light);">
                <div style="font-size:60px; margin-bottom:15px;">📢</div>
                <h3 style="font-size:18px;">No Announcements Yet!</h3>
            </div>`;
        return;
    }

    list.innerHTML = announcements.map(ann => `
        <div class="card" style="padding:20px; margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between;
                        align-items:center;">
                <div>
                    <h3 style="font-size:15px; font-weight:600;">
                        ${ann.title}
                    </h3>
                    <p style="font-size:12px; color:var(--text-light);">
                        📅 ${ann.date} | 👤 ${ann.postedBy}
                    </p>
                </div>
                <button type="button" onclick="deleteAnnouncement(${ann.id})"
                    style="background:#ff4757; color:white; border:none;
                           padding:8px 15px; border-radius:8px;
                           cursor:pointer; font-size:13px; font-weight:600;">
                    🗑️ Delete
                </button>
            </div>
        </div>`
    ).join('');
}

// DELETE ANNOUNCEMENT
function deleteAnnouncement(id) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    let announcements = JSON.parse(
        localStorage.getItem('announcements') || '[]'
    );
    announcements = announcements.filter(a => a.id !== id);
    localStorage.setItem('announcements', JSON.stringify(announcements));

    loadManageAnnouncements();
    loadStats();
} 

// ADD ANNOUNCEMENT
function addAnnouncement() {
    const title    = document.getElementById('annTitle').value.trim();
    const category = document.getElementById('annCategory').value;
    const content  = document.getElementById('annContent').value.trim();
    const postedBy = document.getElementById('annPostedBy').value.trim();

    // VALIDATION
    if (!title || !category || !content || !postedBy) {
        document.getElementById('annError').style.display = 'block';
        document.getElementById('annSuccess').style.display = 'none';
        return;
    }

    // CREATE NEW ANNOUNCEMENT
    const announcements = JSON.parse(
        localStorage.getItem('announcements') || '[]'
    );

    const newAnn = {
        id: Date.now(),
        title,
        category,
        content,
        date: new Date().toISOString().split('T')[0],
        postedBy
    };

    announcements.unshift(newAnn);
    localStorage.setItem('announcements', JSON.stringify(announcements));

    // SHOW SUCCESS
    document.getElementById('annError').style.display = 'none';
    document.getElementById('annSuccess').style.display = 'block';

    // CLEAR FORM
    document.getElementById('annTitle').value = '';
    document.getElementById('annCategory').value = '';
    document.getElementById('annContent').value = '';
    document.getElementById('annPostedBy').value = '';

    // UPDATE STATS
    loadStats();
}

// LOAD REGISTRATIONS
 async function loadRegistrations() {
    const list = document.getElementById('registrationsList');
    list.innerHTML = `<p style="color:var(--text-light); padding:20px;">
        Loading... ⏳</p>`;

    let registrations = [];

    // TRY FIREBASE FIRST
    try {
        if (typeof getRegistrationsFromFirebase !== 'undefined') {
            registrations = await getRegistrationsFromFirebase();
        }
    } catch (error) {
        // FALLBACK TO LOCALSTORAGE
        registrations = JSON.parse(
            localStorage.getItem('registrations') || '[]'
        );
    }

    if (registrations.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:50px; color:var(--text-light);">
                <div style="font-size:60px; margin-bottom:15px;">👥</div>
                <h3 style="font-size:18px;">No Registrations Yet!</h3>
            </div>`;
        return;
    }

    list.innerHTML = `
        <div class="card" style="overflow:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                    <tr style="background:var(--primary); color:white;">
                        <th style="padding:12px 15px; text-align:left;">#</th>
                        <th style="padding:12px 15px; text-align:left;">Name</th>
                        <th style="padding:12px 15px; text-align:left;">Roll No</th>
                        <th style="padding:12px 15px; text-align:left;">Branch</th>
                        <th style="padding:12px 15px; text-align:left;">Event</th>
                        <th style="padding:12px 15px; text-align:left;">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    ${registrations.map((reg, index) => {
                        const ev = getEventById(reg.id);
                        return `
                        <tr style="border-bottom:1px solid #e0e0e0;
                            background:${index % 2 === 0 ?
                                'var(--card-bg)' : 'var(--bg)'}">
                            <td style="padding:12px 15px;">${index + 1}</td>
                            <td style="padding:12px 15px;">${reg.name}</td>
                            <td style="padding:12px 15px;">${reg.rollNo}</td>
                            <td style="padding:12px 15px;">${reg.branch}</td>
                            <td style="padding:12px 15px;">
                                ${ev ? ev.title : 'Unknown'}
                            </td>
                            <td style="padding:12px 15px;">${reg.phone}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
}

// RUN ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});  