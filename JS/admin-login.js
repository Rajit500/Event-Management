import { auth, db, signInWithEmailAndPassword,
         doc, getDoc } from './firebase.js';

async function adminLogin() {
    const email    = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl  = document.getElementById('adminError');

    if (!email || !password) {
        errorEl.textContent = 'Please enter email and password!';
        errorEl.style.display = 'block';
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth, email, password
        );

        // CHECK IF USER IS ADMIN
        const adminDoc = await getDoc(
            doc(db, 'admins', userCredential.user.uid)
        );

        if (adminDoc.exists()) {
            // SAVE ADMIN INFO
            localStorage.setItem('currentAdmin',
                JSON.stringify(adminDoc.data()));
            // REDIRECT TO ADMIN PANEL
            window.location.href = 'admin.html';
        } else {
            errorEl.textContent = 'You are not authorized as admin!';
            errorEl.style.display = 'block';
        }

    } catch (error) {
        errorEl.textContent = 'Wrong email or password!';
        errorEl.style.display = 'block';
    }
}

window.adminLogin = adminLogin;