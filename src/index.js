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
    deleteDoc
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
let quoteid
//initial load
getDocs(quoteColRef)
    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            q.push({ ...doc.data(), id: doc.id })
        })
        randomQBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let randNum = Math.floor(Math.random() * q.length)
            randomQuoteText.innerText = q[randNum].quote
            randomQuoteAuthor.innerText = q[randNum].author
            quoteid = q[randNum].id
            console.log(randNum)
            console.log(q, quoteid)
        })
    })
    .catch(error => {
        console.log(error)
    })
favQuoteBtn.addEventListener('click', (e) => {
    e.preventDefault()
    addDoc(favQuoteColRef, { quoteID: quoteid })
})
//load favourites
getDocs(favQuoteColRef)
    .then((snapshot) => {
        var favQ = new Set([])
        snapshot.docs.forEach(doc => {
            if (doc.data().quoteID) {
                favQ.add(doc.data().quoteID)
            }
        })
        return favQ
    })
    .then((set) => {

        set.forEach((id) => {
            getDoc(doc(db, 'Quotes', id))
                .then((doc) => {
                    let props = {
                        author: doc.data().author,
                        quote: doc.data().quote,
                        imageRef: doc.data().imageRef,
                        tagsList: doc.data().tags,
                        id: id
                    }
                    let div = document.createElement('div')

                    div.className = 'favDiv'
                    div.innerHTML = favHTML(props)
                    favQuoteSection.append(div)
                    return div
                }).then((div) => {
                    getDocs(favQuoteColRef)
                        .then((snapshot) => {
                            let delButton = div.children[1].children[2]
                            delButton.addEventListener('click', () => {
                                let baseId = delButton.id
                                snapshot.docs.forEach((document) => {

                                    console.log(document.data().quoteID)
                                    if (document.data().quoteID === baseId) {
                                        let docRef = doc(db, 'favQuotes', document.id)
                                        deleteDoc(docRef)
                                        alert('Removed from favourites')
                                    }
                                })

                            })
                        })
                })
        })
    })

