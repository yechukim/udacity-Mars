let store = {
    user: { name: "Friends" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: {},
    roverDetail: {}
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
    let detailBtn = document.querySelectorAll('.detail-btn')

    btn.forEach(btn => btn.addEventListener('click', (e) => {
        const rover = e.target.textContent
        getRecentPhotos(rover)
    }))

    detailBtn.forEach(btn => btn.addEventListener('click', e => {
        getRoverInfo(e.target.dataset.key)
    }))
}

// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
    <div class='block'>
    <header>
        <ul>
            <li h><a href="/">MARS DASHBOARD</a></li>
        </ul>
    </header>
    <div class='title'>Click Rover to see lateset pictures</div>

    <section class='card'>
    <div class="tab-menu">
    <ul class="list">
      <li>
        <div class="btn">${rovers[0]}</div>
        <button class="detail-btn" data-key="${rovers[0]}" >details</button>
      </li>
      <li>
      <div class="btn">${rovers[1]}</div>
      <button class="detail-btn"  data-key="${rovers[1]}">details</button>
      </li>
      <li>
      <div class="btn">${rovers[2]}</div>
      <button class="detail-btn"  data-key="${rovers[2]}">details</button>
      </li>
    </ul>
  </div>
  </section>
  <section class='card'>
  ${SelectedRoverPhoto()}
  </section>
        <main>
        <div class='title'>Image of the day </div>
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
    const photos = store.photos
    const photoArrays = Object.values(photos)
    if (!photoArrays.length > 0) return `<div> if you click rover, you will see pictures here </div>`
    return photoArrays[0].map(photo => {
        return (
            ` <img key="${photo.id}" src="${photo.img_src}" class="rover-img"/>`)
    }).join('')

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
    return fetch(`http://localhost:3000/photos/${rover_name}`)
        .then(res => res.json())
        .then(result => {
            updateStore(store, {
                photos: { [rover_name]: [...result.latest_photos] }
            })
        })
}

const getRoverInfo = (rover_name) => {
    if (!rover_name) return
    fetch(`http://localhost:3000/rover/${rover_name}`)
        .then(res => res.json())
        .then(({ photo_manifest }) => {
            const { landing_date, launch_date, max_date, max_sol, name, status } = photo_manifest
            updateStore(store, {
                roverDetail: {
                    [rover_name]: {
                        landing_date,
                        launch_date,
                        max_date,
                        max_sol,
                        name,
                        status,
                    }
                }
            })
        })
}