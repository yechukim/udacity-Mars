
let store = {
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: {},
    roverDetail: {}
}

const greeting = Immutable.Map({
    name: 'Friend',
    date: new Date()
})


// add our markup to the page
const root = document.getElementById('root')

window.addEventListener('load', () => {
    render(root, store)
})
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
    attachEvent()
    attachModalEvent()
}
let roverClicked 
function attachEvent() {
    let btn = document.querySelectorAll('.btn')
    btn.forEach(btn => btn.addEventListener('click', (e) => {
        const rover = e.target.textContent
        getRecentPhotos(rover)
        roverClicked = true
    }))
}

function attachModalEvent() {

    let detailBtn = document.querySelectorAll('.detail-btn')
    let modal = document.querySelector('.modal')
    let closeBtn = document.querySelector('.close-btn')

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none'
    })
    detailBtn.forEach(btn => btn.addEventListener('click', e => {
        getRoverInfo(e.target.dataset.key)
        roverClicked = false
    }))
    if (roverClicked || !store.roverDetail?.rover) return
    showModal()

    function showModal() {
        modal.style.display = 'block'
    }
}

// create content
const App = (state) => {
    let { rovers, apod } = state
    const { name, date } = greeting.toJS()

    return `
    <div class='block'>
    <header>
    <div class='greeting'>Hello, ${name}! 🙈 today is ${date.toDateString()}</div>
        <ul>
            <li h><a href="/">MARS DASHBOARD</a></li>
        </ul>
    </header>
    <div class='title'>Click buttons below to see lateset pictures</div>

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
        <div class="modal">
        <div class="modal-content">
        <span class="close-btn">X</span>
        ${RoverDetail()}
        </div>
    </div>
    </div>
    `
}
const RoverDetail = () => {
    if (store.roverDetail?.rover) {
        const { landing_date, launch_date, max_date, max_sol, name, status } = store.roverDetail.rover
        return (
            `
            <div class="modal-detail">
                <div>landing date : ${landing_date}</div>
                <div>launch date : ${launch_date}</div>
                <div>max date : ${max_date}</div>
                <div>max sol : ${max_sol}</div>
                <div>name : ${name}</div>
                <div>status : ${status}</div>
            </div>
            `
        )
    }
    return `<div> loading error</div>`
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
    return fetch(`http://localhost:3000/rover/${rover_name}`)
        .then(res => res.json())
        .then(({ photo_manifest }) => {
            const { landing_date, launch_date, max_date, max_sol, name, status } = photo_manifest
            updateStore(store, {
                roverDetail: {
                    rover: {
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