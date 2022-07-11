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
const startingCatnip = 2
const warningThreshold = 20

//#region ITEM LIST

function itemCatnip (quantity) {
  this.name = "catnip"
  this.quantity =  quantity
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
  let currentKitten = kittens.find(kitten => kitten?.name.toUpperCase() === name.toUpperCase())

  if (!currentKitten) {
    let newKitten = {
      id: generateId(),
      name: name,
      mood: defaultMood,
      affection: defaultAffection,
      inventory: {}
    }
    newKitten.inventory["itemCatnip"] = new itemCatnip(startingCatnip)
    kittens.push(newKitten)
    saveKittens()
  } else {
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
    if (!kitten.inventory.hasOwnProperty("itemCatnip")) {
      kitten.inventory["itemCatnip"] = new itemCatnip(startingCatnip)
    }
    template+= `
      <div class="card m-1">
        <label id="label-kitten-name" class="text-center">${kitten.name}</label>
        <img id="image-${kitten.id}" class="kitten ${kitten.mood.name}" src="kittenTransparent.png" alt="No Image">
        <label class="text-center">Mood: ${kitten.mood.name}</label>
        <label class="text-center">Affection: ${kitten.affection.toString().indexOf(".") >= 0 ? kitten.affection.toString().slice(0,kitten.affection.toString().indexOf(".") + 3) : kitten.affection}%</label>
        <div class="text-center">
          <div>
            <button id="button-pet" title="Increases affection by ${petAffectionChange * 100}%" onclick="pet('${kitten.id}')">Pet</button>
            <button id="button-catnip" title="Increases affection by ${catnipAffectionChange * 100}%" onclick="catnip('${kitten.id}')">Catnip: ${kitten.inventory.itemCatnip.quantity}</button>
            <button id="button-adventure" title="Decreases affection by ${adventureAffectionChange * 100}%" onclick="adventure('${kitten.id}')">Adventure</button>
          </div>
          <i id="delete-kitten-icon" title="Removes the kitten" class="fa fa-trash" aria-hidden="true" onclick="deleteKitten('${kitten.id}')"></i>
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
  if (!isGone(id)) {
    let currentKitten = findKittenById(id)
    currentKitten.affection += currentKitten.affection * petAffectionChange
    if (currentKitten.affection > maxAffection) {
      currentKitten.affection = maxAffection
    }
    saveKittens()
    setKittenMood(currentKitten)
  }
}

function catnip(id) {
  if (!isGone(id)) {
    let currentKitten = findKittenById(id)
    
    if (currentKitten.inventory.itemCatnip.quantity > 0) {
      currentKitten.affection += currentKitten.affection * catnipAffectionChange
      if (currentKitten.affection > maxAffection) {
        currentKitten.affection = maxAffection
      }
      currentKitten.inventory.itemCatnip.quantity--
      saveKittens()
      setKittenMood(currentKitten)
    }
  }
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * @param {string} id
 * TODO Remove negative affection
 */
function adventure(id) {
  if (!isGone(id)) {
    let currentKitten = findKittenById(id)
    currentKitten.affection -= currentKitten.affection * adventureAffectionChange
    if (currentKitten.affection < minAffection) {
      currentKitten.affection = minAffection
    }
    let discoveredCatnip = randomIntFromInterval(0, 1)
    if (discoveredCatnip > 0) {
      alert(`${currentKitten.name} found ${discoveredCatnip} catnip!`)
      if (currentKitten.inventory.hasOwnProperty("itemCatnip")) {
        currentKitten.inventory.itemCatnip.quantity += discoveredCatnip
      } else {
        currentKitten.inventory["itemCatnip"] = new itemCatnip(discoveredCatnip)
      }
    }
    saveKittens()
    setKittenMood(currentKitten)
  }
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
        currentMood = tempMood
      }
    }
  }
  kitten.mood = currentMood
  saveKittens()
  document.getElementById(elementID)?.classList.add(kitten.mood.name)
  if (kitten.mood === moods.gone) {
    kitten.affection = minAffection
  }
  if(kitten.affection <= warningThreshold && !isGone(kitten.id)) {
    alert(`${kitten.name} will run away when affection drops below 15%!`)
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

function isGone(id) {
  let currentKitten = findKittenById(id)
  return currentKitten.mood === moods.gone
}

/**
 * Removes the welcome content and should probably draw the 
 * list of kittens to the page. Good Luck
 */
function getStarted() {
  document.getElementById("welcome")?.remove();
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
 * @typedef {{id: string, name: string, mood: object, affection: number, inventory: object}} Kitten
 */


/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return Math.floor(Math.random() * 10000000) + "-" + Math.floor(Math.random() * 10000000)
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

loadKittens();
drawKittens();
