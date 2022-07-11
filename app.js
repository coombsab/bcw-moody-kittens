let kittens = []
const moods = {
  gone: {
    name: "gone",
    affection: 0
  },
  angry: {
    name: "angry",
    affection: 15
  },
  sad: {
    name: "sad",
    affection: 25
  },
  content: {
    name: "content",
    affection: 45
  },
  happy: {
    name: "happy",
    affection: 75
  },
  ecstatic: {
    name: "ecstatic",
    affection: 95
  }
}

const defaultMood = moods.content
const defaultAffection = 65
const minAffection = 0
const maxAffection = 100
const petAffectionChange = 0.05
const catnipAffectionChange = 0.15
const adventureAffectionChange = 0.1

//#region ITEM LIST

let catnipItem = {
  name: "catnip",
  quantity: 0
}

//#endregion  END OF ITEM LIST

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
      mood: defaultMood,
      affection: defaultAffection,
      inventory: {}
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
        <img id="image-${kitten.id}" class="${kitten.mood.name}" src="kittenTransparent.png" alt="No Image">
        <label class="text-center">Mood: ${kitten.mood.name}</label>
        <div class="text-center">
          <div>
            <button id="button-pet" onclick="pet('${kitten.id}')">Pet</button>
            <button id="button-catnip" onclick="catnip('${kitten.id}')">Catnip</button>
            <button id="button-adventure" onclick="adventure('${kitten.id}')">Adventure</button>
          </div>
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
  return kittens.find(kitten => kitten.id === id)
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
  let currentKitten = findKittenById(id)
  console.log(currentKitten.name + " was " + currentKitten.mood.name + " : " + currentKitten.affection)
  currentKitten.affection += currentKitten.affection * petAffectionChange
  if (currentKitten.affection > maxAffection) {
    currentKitten.affection = maxAffection
  }
  saveKittens()
  setKittenMood(currentKitten)
}

function catnip(id) {
  let currentKitten = findKittenById(id)
  console.log(currentKitten.name + " was " + currentKitten.mood.name + " : " + currentKitten.affection)
  currentKitten.affection += currentKitten.affection * catnipAffectionChange
  if (currentKitten.affection > maxAffection) {
    currentKitten.affection = maxAffection
  }
  saveKittens()
  setKittenMood(currentKitten)
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * @param {string} id
 * TODO Remove negative affection
 */
function adventure(id) {
  let currentKitten = findKittenById(id)
  console.log(currentKitten.name + " was " + currentKitten.mood.name + " : " + currentKitten.affection)
  currentKitten.affection -= currentKitten.affection * adventureAffectionChange
  if (currentKitten.affection < minAffection) {
    currentKitten.affection = minAffection
  }
  saveKittens()
  setKittenMood(currentKitten)
}

/**
 * Sets the kittens mood based on its affection
 * @param {Kitten} kitten 
 */
function setKittenMood(kitten) {
  let elementID = "image-" + kitten.id
  document.getElementById(elementID)?.classList.remove(kitten.mood.name)
  let currentMood = ""
  for (const mood in moods) {
    if (moods.hasOwnProperty(mood)) {
      let tempMood = moods[mood]
      if (kitten.affection >= tempMood.affection) {
        // console.log(`${kitten.affection} : ${tempMood.affection}`)
        currentMood = tempMood
      }
    }
  }
  kitten.mood = currentMood
  saveKittens()
  document.getElementById(elementID)?.classList.add(kitten.mood.name)
  console.log(`${kitten.name} is now ${kitten.mood.name} with ${kitten.affection}% affection`)
  if (kitten.mood === moods.gone) {
    kitten.affection = minAffection
  }
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
