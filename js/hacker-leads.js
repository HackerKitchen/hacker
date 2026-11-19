import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { addDoc, collection, getFirestore, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const app = initializeApp({
  apiKey: "AIzaSyBu4DJAxE_mn7MsVZNa-PMu-WNuFNsEPGU",
  projectId: "casaglick-439b2",
  appId: "1:888985882616:web:92464a1e63ee74ef3fd00d",
}, 'hacker-contact');
const leads = collection(getFirestore(app), 'hackerLeads');

export function saveHackerLead(fields) {
  return addDoc(leads, {
    ...fields,
    consent: true,
    status: 'Nuevo',
    createdAt: serverTimestamp(),
  });
}
