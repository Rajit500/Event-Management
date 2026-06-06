// DEFAULT ANNOUNCEMENTS
const defaultAnnouncements = [
    {
        id: 1,
        title: "College Fest 2026 Registration Open!",
        content: "Registration for College Fest 2026 is now open. All students are encouraged to participate in various events. Last date to register is 30th April 2026.",
        category: "Important",
        date: "2026-04-19",
        postedBy: "Admin"
    },
    {
        id: 2,
        title: "Holiday Notice — 25th April",
        content: "The college will remain closed on 25th April 2026 on account of a national holiday. All events scheduled for that day will be rescheduled.",
        category: "Notice",
        date: "2026-04-18",
        postedBy: "Principal Office"
    },
    {
        id: 3,
        title: "New Computer Lab Inaugurated",
        content: "A brand new computer lab with 50 high end systems has been inaugurated on the 3rd floor of the IT block. Students can use it from Monday to Saturday.",
        category: "News",
        date: "2026-04-17",
        postedBy: "IT Department"
    },
    {
        id: 4,
        title: "Scholarship Applications Open",
        content: "Applications for merit based scholarships are now open. Eligible students with above 75% attendance and 8.0 CGPA can apply through the admin office.",
        category: "Important",
        date: "2026-04-15",
        postedBy: "Admin"
    }
];

// GET ANNOUNCEMENTS
function getAnnouncements() {
    const stored = localStorage.getItem('announcements');
    if (stored) {
        return JSON.parse(stored);
    } else {
        localStorage.setItem('announcements', 
            JSON.stringify(defaultAnnouncements));
        return defaultAnnouncements;
    }
}

// GET CATEGORY COLOR
function getCategoryColor(category) {
    switch(category) {
        case 'Important': return { bg: '#fff3e0', color: '#FF9800' };
        case 'Notice':    return { bg: '#fde8f4', color: '#E91E8C' };
        case 'News':      return { bg: '#e8f4fd', color: '#2196F3' };
        default:          return { bg: '#e8fdf0', color: '#4CAF50' };
    }
}

// FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// LOAD ANNOUNCEMENTS
function loadAnnouncements() {
    const list = document.getElementById('announcementsList');
    const announcements = getAnnouncements();

    if (announcements.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:50px; color:var(--text-light);">
                <div style="font-size:60px; margin-bottom:15px;">📢</div>
                <h3 style="font-size:18px;">No Announcements Yet!</h3>
            </div>`;
        return;
    }

    list.innerHTML = announcements.map(ann => {
        const colors = getCategoryColor(ann.category);
        return `
        <div class="card" style="padding:25px; margin-bottom:20px;">

            <!-- TOP ROW -->
            <div style="display:flex; justify-content:space-between; 
                        align-items:center; margin-bottom:12px;">
                <span style="background:${colors.bg}; color:${colors.color};
                             padding:3px 12px; border-radius:20px;
                             font-size:12px; font-weight:600;">
                    ${ann.category}
                </span>
                <span style="font-size:12px; color:var(--text-light);">
                    📅 ${formatDate(ann.date)}
                </span>
            </div>

            <!-- TITLE -->
            <h3 style="font-size:18px; font-weight:600; 
                       margin-bottom:10px; color:var(--text);">
                ${ann.title}
            </h3>

            <!-- CONTENT -->
            <p style="font-size:14px; color:var(--text-light); 
                      line-height:1.8; margin-bottom:12px;">
                ${ann.content}
            </p>

            <!-- POSTED BY -->
            <p style="font-size:12px; color:var(--text-light); 
                      border-top:1px solid #e0e0e0; padding-top:10px;">
                👤 Posted by <strong>${ann.postedBy}</strong>
            </p>

        </div>`;
    }).join('');
}

// RUN ON PAGE LOAD
document.addEventListener('DOMContentLoaded', loadAnnouncements);