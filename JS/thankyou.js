// GET URL PARAMETERS
function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        name: params.get('name')
    };
}

// FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// LOAD PASS CARD
function loadPass() {
    const { id, name } = getParams();
    const event = getEventById(id);

    if (!event) return;

    // GET STUDENT REGISTRATION DETAILS
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const student = registrations.find(r => 
        r.id === parseInt(id) && r.name === name
    );

    if (!student) return;

    document.getElementById('passCard').innerHTML = `
        <div class="pass-title">🎫 Event Pass</div>

        <div class="pass-row">
            <span class="pass-label">Event</span>
            <span class="pass-value">${event.title}</span>
        </div>
        <div class="pass-row">
            <span class="pass-label">Student Name</span>
            <span class="pass-value">${student.name}</span>
        </div>
        <div class="pass-row">
            <span class="pass-label">Roll Number</span>
            <span class="pass-value">${student.rollNo}</span>
        </div>
        <div class="pass-row">
            <span class="pass-label">Branch</span>
            <span class="pass-value">${student.branch}</span>
        </div>
        <div class="pass-row">
            <span class="pass-label">Year</span>
            <span class="pass-value">${student.year}</span>
        </div>
        <div class="pass-row">
            <span class="pass-label">Event Date</span>
            <span class="pass-value">${formatDate(event.date)}</span>
        </div>
        <div class="pass-row">
            <span class="pass-label">Venue</span>
            <span class="pass-value">${event.venue}</span>
        </div>
        <div class="pass-row">
            <span class="pass-label">Category</span>
            <span class="pass-value">${event.category}</span>
        </div>`;
}

// DOWNLOAD PASS AS IMAGE
function downloadPass() {
    const pass = document.getElementById('passCard');
    
    // Simple print approach
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Event Pass</title>
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    background: #f4f6fb;
                }
                .pass-card {
                    background: linear-gradient(135deg, #6C63FF, #FF6584);
                    border-radius: 16px;
                    padding: 30px;
                    color: white;
                    width: 400px;
                }
                .pass-title {
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    padding-bottom: 15px;
                }
                .pass-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 14px;
                }
                .pass-label { opacity: 0.8; }
                .pass-value { font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="pass-card">
                ${pass.innerHTML}
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// RUN ON PAGE LOAD
document.addEventListener('DOMContentLoaded', loadPass);