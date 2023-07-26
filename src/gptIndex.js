import favHTML from './js/favouriteHTML';
import testerHTML from './js/testerHTML';
import { initializeApp } from 'firebase/app'
import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  getDoc,
  doc,
  deleteDoc
} from 'firebase/firestore'

// Firebase configuration
const fbConfig = { 
    apiKey: "AIzaSyAfBBXIK9KE_wT7MXG-lq10qI2Ukk8dtp0",
    authDomain: "fbpractice-6f691.firebaseapp.com",
    projectId: "fbpractice-6f691",
    storageBucket: "fbpractice-6f691.appspot.com",
    messagingSenderId: "841655069237",
    appId: "1:841655069237:web:106581cd50f7d3f89b5f7c"
 };

// Initialize Firebase
initializeApp(fbConfig);
const db = getFirestore();
const quoteColRef = collection(db, 'Quotes');
const favQuoteColRef = collection(db, 'favQuotes');

// Cached DOM elements
const quoteContainer = document.querySelector('.quotes');
const randomQBtn = document.getElementById('generateQuoteBtn');
const randomQuoteText = document.getElementById('quoteText');
const randomQuoteAuthor = document.getElementById('quoteAuthor');
const favQuoteBtn = document.getElementById('addFav');
const favQuoteSection = document.getElementById('favQuoteSec');

// Array to store all quotes
const q = [];
let quoteid;

// Function to generate random quote
function generateRandomQuote() {
  let randNum = Math.floor(Math.random() * q.length);
  randomQuoteText.innerText = q[randNum].quote;
  randomQuoteAuthor.innerText = q[randNum].author;
  quoteid = q[randNum].id;
}

// Function to handle delete favorite quote
function handleDeleteFavorite(e) {
  if (!e.target.matches('.deleteButton')) return;
  const baseId = e.target.id;
  getDocs(favQuoteColRef).then((snapshot) => {
    snapshot.docs.forEach((document) => {
      if (document.data().quoteID === baseId) {
        let docRef = doc(db, 'favQuotes', document.id);
        deleteDoc(docRef);
        alert('Removed from favorites');
      }
    });
  });
}

// Event listeners
randomQBtn.addEventListener('click', generateRandomQuote);

favQuoteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  addDoc(favQuoteColRef, { quoteID: quoteid });
});

favQuoteSection.addEventListener('click', handleDeleteFavorite);

// Load initial quotes
async function loadInitialQuotes() {
  try {
    const snapshot = await getDocs(quoteColRef);
    snapshot.docs.forEach((doc) => {
      q.push({ ...doc.data(), id: doc.id });
    });
  } catch (error) {
    console.log(error);
  }
}

// Load favorite quotes
async function loadFavoriteQuotes() {
  try {
    const snapshot = await getDocs(favQuoteColRef);
    const favQ = new Set();
    snapshot.docs.forEach((doc) => {
      if (doc.data().quoteID) {
        favQ.add(doc.data().quoteID);
      }
    });

    for (const id of favQ) {
      const docRef = doc(db, 'Quotes', id);
      const docSnap = await getDoc(docRef);
      const props = {
        author: docSnap.data().author,
        quote: docSnap.data().quote,
        imageRef: docSnap.data().imageRef,
        tagsList: docSnap.data().tags,
        id: id
      };
      const div = document.createElement('div');
      div.className = 'favDiv';
      div.innerHTML = favHTML(props);
      favQuoteSection.append(div);
    }
  } catch (error) {
    console.log(error);
  }
}

// Load initial and favorite quotes
loadInitialQuotes().then(() => loadFavoriteQuotes());
