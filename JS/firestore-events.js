import { db, collection, getDocs,
         addDoc, deleteDoc, doc,
         updateDoc, query } from './firebase.js';

// GET ALL EVENTS FROM FIREBASE
async function getEventsFromFirebase() {
    try {
        const snapshot = await getDocs(collection(db, 'events'));
        const events = [];
        snapshot.forEach(doc => {
            events.push({ firestoreId: doc.id, ...doc.data() });
        });
        return events;
    } catch (error) {
        console.error('Error getting events:', error);
        return [];
    }
}

// ADD EVENT TO FIREBASE
async function addEventToFirebase(eventData) {
    try {
        const docRef = await addDoc(collection(db, 'events'), eventData);
        return docRef.id;
    } catch (error) {
        console.error('Error adding event:', error);
        return null;
    }
}

// DELETE EVENT FROM FIREBASE
async function deleteEventFromFirebase(firestoreId) {
    try {
        await deleteDoc(doc(db, 'events', firestoreId));
        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
}

// UPDATE FILLED SEATS IN FIREBASE
async function updateFilledSeats(firestoreId, newFilledSeats) {
    try {
        await updateDoc(doc(db, 'events', firestoreId), {
            filledSeats: newFilledSeats
        });
        return true;
    } catch (error) {
        console.error('Error updating seats:', error);
        return false;
    }
}

// ADD REGISTRATION TO FIREBASE
async function addRegistrationToFirebase(registrationData) {
    try {
        await addDoc(collection(db, 'registrations'), registrationData);
        return true;
    } catch (error) {
        console.error('Error adding registration:', error);
        return false;
    }
}

// GET ALL REGISTRATIONS FROM FIREBASE
async function getRegistrationsFromFirebase() {
    try {
        const snapshot = await getDocs(collection(db, 'registrations'));
        const registrations = [];
        snapshot.forEach(doc => {
            registrations.push({ firestoreId: doc.id, ...doc.data() });
        });
        return registrations;
    } catch (error) {
        console.error('Error getting registrations:', error);
        return [];
    }
}

window.getEventsFromFirebase = getEventsFromFirebase;
window.addEventToFirebase = addEventToFirebase;
window.deleteEventFromFirebase = deleteEventFromFirebase;
window.updateFilledSeats = updateFilledSeats;
window.addRegistrationToFirebase = addRegistrationToFirebase;
window.getRegistrationsFromFirebase = getRegistrationsFromFirebase;