let kittens = []
let moods = [
  "gone",
  "angry",
  "sad",
  "content",
  "happy",
  "ecstatic"
]
let defaultAffection = 3
const minAffection = 1
const maxAffection = 5

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()

  let form = event.target
  let name = form.name.value

  console.log(name)

  let currentKitten = kittens.find(kitten => kitten?.name.toUpperCase() === name.toUpperCase())

  if (!currentKitten) {
    let newKitten = {
      id: generateId(),
      name: name,
      mood: moods[defaultAffection],
      affection: defaultAffection
    }
    kittens.push(newKitten)
    console.log(newKitten)
    saveKittens()
  } else {
    console.log("Already existing kitten: ", currentKitten?.name)
    alert("Kitten already exists!")
  }

  form.reset()
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens 
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittensData = JSON.parse(window.localStorage.getItem("kittens"))
  if (kittensData) {
    kittens = kittensData
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let template = ""

  kittens.sort(function(a, b) {
    let textA = a.name.toUpperCase()
    let textB = b.name.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })

  kittens.forEach(kitten => {
    template+= `
      <div class="card m-1">
        <label class="text-center">${kitten.name}</label>
        <img id="image-${kitten.id}" class="${kitten.mood}" src="kittenTransparent.png" alt="No Image">
        <label class="text-center">Mood: ${kitten.mood}</label>
        <div class="text-center">
          <button id="button-pet" onclick="pet('${kitten.id}')">Pet</button>
          <button id="button-punish" onclick="punish('${kitten.id}')">Punish</button>
          <i id="delete-kitten-icon" class="fa fa-trash" aria-hidden="true" onclick="deleteKitten('${kitten.id}')"></i>
        </div>
      </div>
    `
  })

  document.getElementById("kittens").innerHTML = template
}


/**
 * Find the kitten in the array by its id
 * @param {string} id 
 * @return {Kitten}
 */
function findKittenById(id) {
}


/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .5 
 * increase the kittens affection
 * otherwise decrease the affection
 * @param {string} id 
 */
function pet(id) {
  let currentKitten = kittens.find(kitten => kitten.id === id)
  console.log(currentKitten.name + " was " + currentKitten.mood + " : " + currentKitten.affection)
  if (currentKitten.affection < 5) {
    currentKitten.affection++
    saveKittens()
    setKittenMood(currentKitten)
  }
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * @param {string} id
 * TODO Remove negative affection
 */
function punish(id) {
  let currentKitten = kittens.find(kitten => kitten.id === id)
  console.log(currentKitten.name + " was " + currentKitten.mood + " : " + currentKitten.affection)
  if (currentKitten.affection > 0) {
    currentKitten.affection--
    saveKittens()
    setKittenMood(currentKitten)
  }
}

/**
 * Sets the kittens mood based on its affection
 * @param {Kitten} kitten 
 */
function setKittenMood(kitten) {
  //moods - Gone: 0 Angry: 1 Sad: 2 Content: 3 Happy: 4 Ecstatic: 5
  let elementID = "image-" + kitten.id
  document.getElementById(elementID)?.classList.remove(kitten.mood)
  kitten.mood = moods[kitten.affection]
  saveKittens()
  document.getElementById(elementID)?.classList.add(kitten.mood)
  console.log(kitten.name + " is now " + kitten.mood + " : " + kitten.affection)
  drawKittens()
}

/**
 * Removes all of the kittens from the array
 * remember to save this change
 */
function clearKittens(){
}

function deleteKitten(id) {
  let index = kittens.findIndex(kitten => kitten.id === id)
  let removed = kittens.splice(index, 1)
  saveKittens()
}

/**
 * Removes the welcome content and should probably draw the 
 * list of kittens to the page. Good Luck
 */
function getStarted() {
  document.getElementById("welcome")?.remove();
  console.log('Good Luck, Take it away')
  if (kittens.length === 0) (
    document.getElementById("welcome-message")?.classList.remove("hidden")
  )
  document.getElementById("kittens")?.classList.remove("hidden")
  document.getElementById("kitten-name-form")?.classList.remove("hidden")
  document.getElementById("kitten-name-input")?.focus()
}


// --------------------------------------------- No Changes below this line are needed

/**
 * Defines the Properties of a Kitten
 * @typedef {{name: string, mood: string, affection: number}} Kitten
 */


/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return Math.floor(Math.random() * 10000000) + "-" + Math.floor(Math.random() * 10000000)
}

loadKittens();
drawKittens();
