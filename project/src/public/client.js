let store = {
    user: { name: "Friends" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: {}
}

// add our markup to the page
const root = document.getElementById('root')

window.addEventListener('load', () => {
    // render(root, store.toJS())
    render(root, store)
})
const updateStore = (store, newState) => {
    //  store = Object.assign(store.toJS(), newState)
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
    attachEvent()
}

function attachEvent() {
    let btn = document.querySelectorAll('.btn')
    btn.forEach(btn => btn.addEventListener('click', (e) => {
        const rover = e.target.textContent
        getRecentPhotos(rover)
    }))
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
       
      </li>
      <li>
      <div class="btn">${rovers[1]}</div>

      </li>
      <li>
      <div class="btn">${rovers[2]}</div>

      </li>
    </ul>
  </div>
  <div>
  ${SelectedRoverPhoto()}
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
const SelectedRoverPhoto = () => {

}
const ImageOfTheDay = (apod) => {
    const today = new Date()
    const photodate = new Date(apod.date)
    if (!apod || photodate === today.getDate()) {
        getImageOfTheDay(store)
    }
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

const getRecentPhotos = (rover_name) => {
    console.log(store)
    return fetch(`http://localhost:3000/photos/${rover_name}`)
        .then(res => res.json())
        .then(result => {
            updateStore(store, {
                photos: { [rover_name]: [...result.latest_photos] }
            })
        })
}


const getRoverPhoto = (rover_name) => {
    if (!rover_name) return
    fetch(`http://localhost:3000/rover/${rover_name}`)
        .then(res => res.json())
        .then(photo => console.log(photo))
}
