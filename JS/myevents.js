// FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// SEARCH MY EVENTS BY ROLL NUMBER
function searchMyEvents() {
    const rollNo = document.getElementById('rollInput').value.trim();
    const list = document.getElementById('myEventsList');

    // CHECK IF ROLL NUMBER ENTERED
    if (!rollNo) {
        list.innerHTML = `
            <p style="color:red; font-size:13px;">
                Please enter your roll number!
            </p>`;
        return;
    }

    // GET ALL REGISTRATIONS
    const registrations = JSON.parse(
        localStorage.getItem('registrations') || '[]'
    );

    // FILTER BY ROLL NUMBER
    const myRegistrations = registrations.filter(
        r => r.rollNo.toLowerCase() === rollNo.toLowerCase()
    );

    // IF NO REGISTRATIONS FOUND
    if (myRegistrations.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:50px; color:var(--text-light);">
                <div style="font-size:60px; margin-bottom:15px;">📋</div>
                <h3 style="font-size:18px; margin-bottom:10px;">
                    No Registrations Found!
                </h3>
                <p style="font-size:14px;">
                    You have not registered for any events yet.
                </p>
                <a href="index.html" class="btn btn-primary"
                   style="margin-top:20px; display:inline-block;">
                   Browse Events
                </a>
            </div>`;
        return;
    }

    // SHOW MY REGISTERED EVENTS
    list.innerHTML = myRegistrations.map(reg => {
        const event = getEventById(reg.id);
        if (!event) return '';

        return `
        <div class="card" style="padding:20px; margin-bottom:20px;">
            <div style="display:flex; gap:15px; align-items:center;">

                <!-- EVENT IMAGE -->
                <img src="${event.image}" alt="${event.title}"
                     onerror="this.src='https://via.placeholder.com/100x70?text=Event'"
                     style="width:100px; height:70px;
                            object-fit:cover; border-radius:8px;">

                <!-- EVENT INFO -->
                <div style="flex:1;">
                    <span class="badge ${event.category}">${event.category}</span>
                    <h3 style="font-size:16px; font-weight:600; margin-top:5px;">
                        ${event.title}
                    </h3>
                    <p style="font-size:13px; color:var(--text-light);">
                        📅 ${formatDate(event.date)} &nbsp;|&nbsp; 
                        📍 ${event.venue}
                    </p>
                </div>

                <!-- STATUS BADGE -->
                <div style="text-align:center;">
                    <span style="background:#e8fdf0; color:#4CAF50;
                                 padding:5px 12px; border-radius:20px;
                                 font-size:12px; font-weight:600;">
                        ✅ Registered
                    </span>
                </div>

            </div>

            <!-- STUDENT DETAILS -->
            <div style="margin-top:15px; padding-top:15px;
                        border-top:1px solid #e0e0e0;
                        display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <p style="font-size:13px; color:var(--text-light);">
                    👤 <strong>Name:</strong> ${reg.name}
                </p>
                <p style="font-size:13px; color:var(--text-light);">
                    🎓 <strong>Branch:</strong> ${reg.branch}
                </p>
                <p style="font-size:13px; color:var(--text-light);">
                    📝 <strong>Roll No:</strong> ${reg.rollNo}
                </p>
                <p style="font-size:13px; color:var(--text-light);">
                    📅 <strong>Year:</strong> ${reg.year}
                </p>
            </div>

            <!-- VIEW DETAILS BUTTON -->
            <div style="margin-top:15px;">
                <a href="event-detail.html?id=${event.id}"
                   class="btn btn-outline" style="font-size:13px;">
                   View Event Details
                </a>
            </div>

        </div>`;
    }).join('');
}

// ALLOW PRESSING ENTER TO SEARCH
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('rollInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMyEvents();
    });
});