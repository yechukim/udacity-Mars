
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
    <div class='block'>
    <header>
        <ul>
            <li h><a href="/">APOD</a></li>
            <li>ROVERS</li>
        </ul>
    </header>
        <main>
            <section class='card'>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer>
        <div>2022 udacity project mars</div>
        </footer>
    </div>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})



const RoverPhoto = (rovers) => {
    return rovers.map((rover, index) => {
        return `<div key=${rover + index}>${getRoverPhoto(rover)}</div>`
    })
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
            <p class='desc'>${apod.explanation}</p>
        `)
    } else {

        return (`
            <img
            src="${apod.image.url}" height="350px" width="100%" />
            <p class='desc'>${apod.image.explanation}</p>
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
    fetch(`http://localhost:3000/manifest/${rover_name}`)
        .then(res => {
            console.log(res.json())
            return res.json()
        })
        .catch(err => console.log(err))
    return
}
