
let store = {
    user: { name: "Friends" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <div class='navbar'> 
            <h1>Explore Mars</h1>
        </div>

        <main>
            ${Welcome(store.user.name)}
            <section>
            <h2 class='title'> Image of Today</h2>
                ${ImageOfTheDay(apod)}
            </section>

            <section class='rover_photo'>
            ${RoverPhoto(rovers)}
            </secion
        </main>
        <footer></footer>
    `
}

// <h2 class='title'> Select Rovers You want to Check out ! 🪐</h2>
// <div class='rovers-wrapper'>
// ${RoverCard(rovers)}
// </div>

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})
function getRover(rover) {
    console.log(rover)
}
//COMPONENTS 
const Welcome = (who) => {
    if (who) {
        return `<h1 class='welcome'>Welcome ${who} :) </h1>`
    }
    return `<h1 class='welcome'>Welcome ;) </h1>`
}

const RoverPhoto = (rovers) => {
    return rovers.map((rover, index) => {
        return `<div key=${rover + index}>${getRoverPhoto(rover)}</div>`
    })
}

const RoverCard = (rovers) => {
    return rovers.map((rover, index) => {
        return `
        <div
        onclick="clickRover()"
        class='rover' 
        key=${rover + index}>
        <h3 class='roverName'>
        ${rover}
        </h3>
        <p class='smallp'>click to see details...</p>        
        </div>
        <div class='rover-detail'>
        ${getRover(rover)}
        </div>
        `
    }).join('')
}


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    if (!apod || photodate === today.getDate()) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {

        return (`
            <img
            src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// API CALL
const getImageOfTheDay = (state) => {

    return fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}
const getRovers = (state) => {

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(rovers => console.log(rovers))
}

const getRoverPhoto = (rover_name) => {
    fetch(`http://localhost:3000/rovers/${rover_name}`)
        .then(res => res.json())
        .catch(err => console.log(err))
    //.then(res => console.log(res))
    return
}
