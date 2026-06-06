// AUTO FILL FROM STUDENT PROFILE
 function autoFillForm() {
    const student = JSON.parse(
        localStorage.getItem('currentStudent') || 'null'
    );
    
    console.log('Student data:', student);

    if (!student) {
        console.log('No student found — redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('studentName').value = student.name || '';
    document.getElementById('rollNo').value = student.roll || '';
    document.getElementById('branch').value = student.branch || '';
    document.getElementById('year').value = student.year || '';
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('email').value = student.email || '';

    document.getElementById('studentName').readOnly = true;
    document.getElementById('rollNo').readOnly = true;
    document.getElementById('phone').readOnly = true;
    document.getElementById('email').readOnly = true;
}

// GET EVENT ID FROM URL
function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// LOAD EVENT INFO AT TOP
function loadEventInfo() {
    const id = getIdFromURL();
    const event = getEventById(id);

    if (!event) return;

    document.getElementById('eventInfo').innerHTML = `
        <div style="display:flex; align-items:center; gap:15px;">
            <img src="${event.image}" alt="${event.title}"
                 onerror="this.src='https://via.placeholder.com/100x70?text=Event'"
                 style="width:100px; height:70px; 
                        object-fit:cover; border-radius:8px;">
            <div>
                <span class="badge ${event.category}">${event.category}</span>
                <h3 style="font-size:16px; font-weight:600; margin-top:5px;">
                    ${event.title}
                </h3>
                <p style="font-size:13px; color:var(--text-light);">
                    📅 ${formatDate(event.date)} &nbsp;|&nbsp; 📍 ${event.venue}
                </p>
            </div>
        </div>`;

        // SHOW COLLEGE NAME FIELD IF INTER COLLEGE
if (event.eventType === 'inter') {
    document.getElementById('collegeGroup').style.display = 'block';
} else {
    document.getElementById('collegeGroup').style.display = 'none';
    // AUTO FILL COLLEGE NAME FOR INTRA
    document.getElementById('collegeName') &&
        (document.getElementById('collegeName').value = 'ITS Engineering College');
}
}

// FORMAT DATE
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
}

// REGISTER STUDENT
async function registerStudent() {
    const id = parseInt(getIdFromURL());
    const name    = document.getElementById('studentName').value.trim();
    const rollNo  = document.getElementById('rollNo').value.trim();
    const branch  = document.getElementById('branch').value;
    const year    = document.getElementById('year').value;
    const phone   = document.getElementById('phone').value.trim();
    const email   = document.getElementById('email').value.trim();

     // VALIDATION
if (!name || !rollNo || !branch || !year || !phone || !email) {
    document.getElementById('errorMsg').innerText = 'Please fill all fields!';
    document.getElementById('errorMsg').style.display = 'block';
    return;
}

// NAME VALIDATION — only letters and spaces allowed
if (!/^[a-zA-Z\s]+$/.test(name)) {
    document.getElementById('errorMsg').innerText = 'Name must contain letters only!';
    document.getElementById('errorMsg').style.display = 'block';
    return;
}

// PHONE VALIDATION — must be exactly 10 digits
if (!/^[0-9]{10}$/.test(phone)) {
    document.getElementById('errorMsg').innerText = 'Phone number must be exactly 10 digits!';
    document.getElementById('errorMsg').style.display = 'block';
    return;
}

// EMAIL VALIDATION
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('errorMsg').innerText = 'Please enter a valid email!';
    document.getElementById('errorMsg').style.display = 'block';
    return;
}

    // HIDE ERROR
    document.getElementById('errorMsg').style.display = 'none';

    // SAVE REGISTRATION TO FIREBASE
const registration = { id, name, rollNo, branch, year, phone, email,
    registeredAt: new Date().toISOString() };

// SAVE TO LOCALSTORAGE AS BACKUP
let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
registrations.push(registration);
localStorage.setItem('registrations', JSON.stringify(registrations));

// SAVE TO FIREBASE
if (typeof addRegistrationToFirebase !== 'undefined') {
    await addRegistrationToFirebase(registration);
}

// UPDATE FILLED SEATS IN FIREBASE
let allEvents = getEvents();
const currentEvent = allEvents.find(e => e.id === id);
if (currentEvent && currentEvent.firestoreId) {
    if (typeof updateFilledSeats !== 'undefined') {
        await updateFilledSeats(
            currentEvent.firestoreId,
            currentEvent.filledSeats + 1
        );
    }
}

// UPDATE LOCALSTORAGE
allEvents = allEvents.map(e => {
    if (e.id === id) {
        return { ...e, filledSeats: e.filledSeats + 1 };
    }
    return e;
});  
localStorage.setItem('events', JSON.stringify(allEvents));

 // GO TO THANK YOU PAGE
window.location.href = `thankyou.html?id=${id}&name=${name}`;

}

// RUN ON PAGE LOAD
 document.addEventListener('DOMContentLoaded', () => {
    loadEventInfo();
    autoFillForm();
});