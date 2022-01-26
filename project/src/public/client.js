
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
            <div class='list'>
                <a href="/">Home </a>
            
            </div>
        </div>

        <main>
            ${Welcome(store.user.name)}
            <section>
            <h2 class='title'> Image of Today</h2>
                ${ImageOfTheDay(apod)}

                <h2 class='title'> Select Rovers You want to Check out ! 🪐</h2>
                <div class='rovers-wrapper'>
                ${RoversInfo(rovers)}
                </div>
            </section>

            
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

//COMPONENTS 
const Welcome = (who) => {
    if (who) {
        return `<h1 class='welcome'>Welcome ${who} :) </h1>`
    }
    return `<h1 class='welcome'>Welcome ;) </h1>`
}

const RoversInfo = (rovers) => {
    return rovers.map((rover, index) => {
        return `
        <div
        class='rover' 
        key=${rover + index}>
        <h3>${rover}</h3>
        <p>rovers desc</p>
        
        </div>
        `
    }).join('')
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    if (!apod || apod.date === today.getDate() ) {
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
    let { apod } = state

    return fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}
const getRovers = (state) => {

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(rovers => console.log(rovers))
}
getRovers()
