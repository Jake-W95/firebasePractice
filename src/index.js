import { initializeApp } from 'firebase/app'

import {
    collection,
    getFirestore,
    getDocs,
    addDoc,
    getDoc,
    // onSnapshot,
    doc
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
    // console.log(quoteid)
    addDoc(favQuoteColRef, { quoteID: quoteid })
})





// TRYING TO INJECT HTML CONTAINING DATA FROM FAVQ COLLECTION AFTER IS IS FETCHED, STRUGGLING AS CAN'T SEEM TO CALL getDoc() INSIDE OF getDocs()

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
                    let author = doc.data().author
                    let quote = doc.data().quote
                    let imageRef = doc.data().imageRef
                    let tagsList = doc.data().tags

                    let div = document.createElement('div')
                    div.className = 'favDiv'
                    div.innerHTML = `
                    <div class="authDiv">
                        <img src="${imageRef}" alt="${author}_image" height="200" width="200">
                        <h1 class="favAuth">${author}: </h1> 
                    </div>
                     
                    <h2 class="favQuote">"${quote}"</h2>
                    <div>
                        ${tagsList.map((tag) => {
                        return `<p>${tag}</p>`
                    })}
                    </div>
                                        `
                    favQuoteSection.append(div)

                })

        })
        // let ref = doc.data().quoteID
    })