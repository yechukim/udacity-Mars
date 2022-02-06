let store = Immutable.Map({
    user: { name: "Friends" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
})

// add our markup to the page
const root = document.getElementById('root')

window.addEventListener('load', () => {
    render(root, store.toJS())
})
const updateStore = (store, newState) => {
    store = Object.assign(store.toJS(), newState)
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
        </ul>
    </header>
    <section class='card'>
    <div class='tab-title'>Click Rover to check its details !</div>
    <div class="tab-menu">
    <ul class="list">
      <li class="is_on">
        <div class="btn">${rovers[0]}</div>
        <div id="tab1" class="cont">${RoverInfo(rovers[0])}</div>
      </li>
      <li>
      <div class="btn">${rovers[1]}</div>
      <div id="tab2" class="cont">${RoverInfo(rovers[1])}</div>
      </li>
      <li>
      <div class="btn">${rovers[2]}</div>
      <div id="tab3" class="cont">${RoverInfo(rovers[2])}</div>
      </li>
    </ul>
  </div>
  </section>
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

const RoverInfo = async (rover) => {
    const response = await getRoversInfo(rover)
    const photos = response.photos
    const img = photos[0].img_src

    return `<img src="${img}"  height="350px" />`
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
        .then(apod => {
            updateStore(store, { apod })
        })
}


const getRoversInfo = (rover_name) => {

    const data = fetch(`http://localhost:3000/rovers/${rover_name}`)
        .then(res => res.json())
        .then(result => result.rovers)
    return data
}

const getRoverPhoto = (rover_name) => {
    if (!rover_name) return
    fetch(`http://localhost:3000/manifest/${rover_name}`)
        .then(res => res.json())
        .then(photo => console.log(`photo ${photo}`))
        .catch(err => console.log(err))
}
