import favHTML from './js/favouriteHTML';
import { initializeApp } from 'firebase/app'
import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'
const fbConfig = {
  apiKey: "AIzaSyAfBBXIK9KE_wT7MXG-lq10qI2Ukk8dtp0",
  authDomain: "fbpractice-6f691.firebaseapp.com",
  projectId: "fbpractice-6f691",
  storageBucket: "fbpractice-6f691.appspot.com",
  messagingSenderId: "841655069237",
  appId: "1:841655069237:web:106581cd50f7d3f89b5f7c"
};

initializeApp(fbConfig)
//Firebase variables
const db = getFirestore()
const quoteColRef = collection(db, 'Quotes')
const favQuoteColRef = collection(db, 'favQuotes')
// DOM elements
const randomQBtn = document.getElementById('generateQuoteBtn')
const randomQuoteText = document.getElementById('quoteText')
const randomQuoteAuthor = document.getElementById('quoteAuthor')
const favQuoteBtn = document.getElementById('addFav')
const favQuoteSection = document.getElementById('favQuoteSec')

const q = []
const favouriteQuotes = new Set()
let quoteid
let prevNum

function generateRandomQuote() {
  let randNum = Math.floor(Math.random() * q.length)
  if (prevNum === randNum) {
    return generateRandomQuote()
  }
  randomQuoteText.innerText = q[randNum].quote
  randomQuoteAuthor.innerText = q[randNum].author
  quoteid = q[randNum].id

  prevNum = randNum
}

function handleDeleteFavorite(e) {
  if (!e.target.matches('.deleteFav')) return;
  // ID from primary Quotes collection
  const baseId = e.target.id;

  getDocs(favQuoteColRef).then((snapshot) => {
    snapshot.docs.forEach((document) => {
      if (document.data().quoteID === baseId) {
        let docRef = doc(db, 'favQuotes', document.id);
        deleteDoc(docRef);
      }
    });
  });
  favouriteQuotes.delete(baseId)
}

randomQBtn.addEventListener('click', generateRandomQuote)

favQuoteBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(favouriteQuotes.has(quoteid), quoteid, favouriteQuotes)

  if (!favouriteQuotes.has(quoteid)) {
    addDoc(favQuoteColRef, { quoteID: quoteid })
    favouriteQuotes.add(quoteid)
    console.log('added')
  } else {
    alert('Already favourited!')
  }
})


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
onSnapshot(favQuoteColRef, (snapshot) => {
  favQuoteSection.innerHTML = ''
  snapshot.docs.forEach((doc) => {
    if (doc.data().quoteID) {
      favouriteQuotes.add(doc.data().quoteID);
    }
  });

  for (const id of favouriteQuotes) {
    const docRef = doc(db, 'Quotes', id);
    // const docSnap = 
    getDoc(docRef).then((docSnap) => {
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
    )
  }
})

loadInitialQuotes()


