const favHTML = ({ author, quote, imageRef, tagsList, id}) => {
    return `
    <div class="authDiv">
        <img src="${imageRef}" alt="${author}_image" height="200" width="200">
        <h1 class="favAuth">${author}    </h1> 
    </div>
     
    <div class="quoteDiv">
        <h2 class="favQuote">"${quote}"</h2>
        <div class="tags">
            ${tagsList.map((tag) => {
            return `<p class="tagItem">${tag}</p>`
            }).join('')
            }
        </div>
        <button class="deleteFav" id="${id}">Delete</button>
    </div>
                        `;
        
}

export default  favHTML 