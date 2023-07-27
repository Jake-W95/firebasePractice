import favHTML from './js/favouriteHTML';
import testerHTML from './js/testerHTML';
import { initializeApp } from 'firebase/app'
import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  getDoc,
  // onSnapshot,
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
const db = getFirestore()
const quoteColRef = collection(db, 'Quotes')
const favQuoteColRef = collection(db, 'favQuotes')

const quoteContainer = document.querySelector('.quotes')
const randomQBtn = document.getElementById('generateQuoteBtn')
const randomQuoteText = document.getElementById('quoteText')
const randomQuoteAuthor = document.getElementById('quoteAuthor')
const favQuoteBtn = document.getElementById('addFav')
const favQuoteSection = document.getElementById('favQuoteSec')

const q = []
const favouriteQuotes = []
let quoteid
let prevNum

function generateRandomQuote() {
  let randNum = Math.floor(Math.random() * q.length)
  if (prevNum === randNum) {
  console.log(randNum, prevNum)

    console.log('same')
    return generateRandomQuote()
  } 
  
    randomQuoteText.innerText = q[randNum].quote
    randomQuoteAuthor.innerText = q[randNum].author
    quoteid = q[randNum].id
  


  console.log(randNum, prevNum, 'end')
  prevNum = randNum
}

function handleDeleteFavorite(e) {
  if (!e.target.matches('.deleteFav')) return;
  const baseId = e.target.id;
  getDocs(favQuoteColRef).then((snapshot) => {
    snapshot.docs.forEach((document) => {
      if (document.data().quoteID === baseId) {
        let docRef = doc(db, 'favQuotes', document.id);
        deleteDoc(docRef);
        // alert('Removed from favorites');
      }
    });
  });
}




// Event Listeners
randomQBtn.addEventListener('click', generateRandomQuote)

favQuoteBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (favouriteQuotes.indexOf(quoteid) === -1) {
    addDoc(favQuoteColRef, { quoteID: quoteid })
    // alert('Added to favourites')
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

// Load favorite quotes
// async function loadFavoriteQuotes() {
//   try {

const loadFavoriteQuotes = onSnapshot(favQuoteColRef, (snapshot) => {
  favQuoteSection.innerHTML = ''
  const favQuoteArr = new Set();
  snapshot.docs.forEach((doc) => {
    if (doc.data().quoteID) {
      favQuoteArr.add(doc.data().quoteID);
    }
  });

  for (const id of favQuoteArr) {
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
// } catch (error) {
//   console.log(error);
// }
// }



loadInitialQuotes()
loadFavoriteQuotes
// .then(() => loadFavoriteQuotes())
