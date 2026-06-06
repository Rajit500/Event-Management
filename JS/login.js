import { auth, db, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, doc, 
         setDoc, getDoc } from './firebase.js';

// SWITCH BETWEEN LOGIN AND SIGNUP
function showAuthTab(tab, btn) {
    document.querySelectorAll('.auth-tab').forEach(t => 
        t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => 
        f.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

// STUDENT SIGNUP
async function signupStudent() {
    const name     = document.getElementById('signupName').value.trim();
    const roll     = document.getElementById('signupRoll').value.trim();
    const branch   = document.getElementById('signupBranch').value;
    const year     = document.getElementById('signupYear').value;
    const phone    = document.getElementById('signupPhone').value.trim();
    const email    = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    const errorEl   = document.getElementById('signupError');
    const successEl = document.getElementById('signupSuccess');

    // VALIDATION
    if (!name || !roll || !branch || !year || !phone || !email || !password) {
        errorEl.textContent = 'Please fill all fields!';
        errorEl.style.display = 'block';
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        errorEl.textContent = 'Phone must be 10 digits!';
        errorEl.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters!';
        errorEl.style.display = 'block';
        return;
    }

    try {
        // CREATE AUTH USER
        const userCredential = await createUserWithEmailAndPassword(
            auth, email, password
        );

        // SAVE STUDENT PROFILE TO FIRESTORE
        await setDoc(doc(db, 'students', userCredential.user.uid), {
            name, roll, branch, year, phone, email,
            role: 'student',
            createdAt: new Date().toISOString()
        });

        errorEl.style.display = 'none';
        successEl.textContent = 'Account created! Please login. ✅';
        successEl.style.display = 'block';

        // CLEAR FORM
        document.getElementById('signupName').value = '';
        document.getElementById('signupRoll').value = '';
        document.getElementById('signupBranch').value = '';
        document.getElementById('signupYear').value = '';
        document.getElementById('signupPhone').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';

    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    }
}

// STUDENT LOGIN
async function loginStudent() {
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl  = document.getElementById('loginError');

    if (!email || !password) {
        errorEl.textContent = 'Please enter email and password!';
        errorEl.style.display = 'block';
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth, email, password
        );

        // GET STUDENT PROFILE
        const studentDoc = await getDoc(
            doc(db, 'students', userCredential.user.uid)
        );

         if (studentDoc.exists()) {
            // SAVE TO LOCALSTORAGE FOR QUICK ACCESS
            localStorage.setItem('currentStudent', 
                JSON.stringify(studentDoc.data()));
            // REDIRECT TO HOME
            window.location.href = 'index.html';
        }

    } catch (error) {
        errorEl.textContent = 'Wrong email or password!';
        errorEl.style.display = 'block';
    }
}

// MAKE FUNCTIONS GLOBAL
window.showAuthTab = showAuthTab;
window.signupStudent = signupStudent;
window.loginStudent = loginStudent;