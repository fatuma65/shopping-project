// Adding items to the list
const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item))
    checkUI() // to display the fitlter and clear all
}
const onAddItemSubmit = (e) => { // you put back addItem to go back to previous
    e.preventDefault();

    const newItem = itemInput.value
    //validate input
    if (newItem === '') {
        alert('please add an item')
        return; 
    }
    //  create list item
    // const li = document.createElement('li');
    // li.appendChild(document.createTextNode(newItem))

    // const button = createButton('remove-item btn-link text-red')
    // li.appendChild(button)
    
    // // add li to the DOM
    // itemList.appendChild(li)

    if (isEditMode) {
        const itemIoEdit = itemList.querySelector('.edit-mode')

        removeItemFromStorage(itemIoEdit.textContent)
        itemIoEdit.classList.remove('edit-mode')
        itemIoEdit.remove()
        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)) {
            alert('that item exixts')
            return;
        }
    }

    // create item DOM element
    addItemToDom(newItem)

    // add item to local storage
    addItemToStorage(newItem)

    checkUI()
    
    itemInput.value = ''
}
// ADDING ITEM TO LOCAL STORAGE
function addItemToDom (item) {
    // create the list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
    
    // add li to the DOM
    itemList.appendChild(li)
}

function createButton(classes) {
    const button = document.createElement('button')
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button
}
function createIcon(classes) {
    const icon = document.createElement('icon')
    icon.className = classes
    return icon;
}

function addItemToStorage(item) {
    // to check whether if we have items on local storage
    const itemsFromStorage = getItemsFromStorage()

    // then we add new item to array
    itemsFromStorage.push(item)

    // After adding item, CONVERT TO JSON STRING AND SET TO LOCAL STORAGE
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

// displaying items from local storage
function getItemsFromStorage () {
    let itemsFromStorage;

    if(localStorage.getItem('items') === null) { // if theres no item in local storage
        itemsFromStorage = [] // the variable is set to an empty array
    } else { // if there are items in the local storage, we parse it 
        itemsFromStorage = JSON.parse(localStorage.getItem('items')) // we do this in order to make the string an array using json
    }

    return itemsFromStorage
}

// Remove item from Local storage or tap anywhere and remove it 
function onClickItem  (e) {
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target)
    }
}
// editing the items.
function setItemToEdit (item) { // here we want to edit the items when we click on them
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode')) // here if we dont what we click on to get into the form 
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent
}
// removing items using the icon and clear
function removeItem(item) {
    // if(e.target.parentElement.classList.contains('remove-item')){ // here we want to remove an icon only if its parent element is a button
    //     // console.log('click')
    //     // e.target.remove()
    //     // e.target.parentElement.parentElement.remove() // here we are targeting the first parent element - button then the second parent li which we want to remove
    //     //  in the above, we are traversing the DOM to get what we want
    //     if (confirm('are you sure?')) { // incase we want to delete the new items we have added and ask whether tthe client is sure or not
    //         e.target.parentElement.parentElement.remove()
    //         checkUI() // this we want everything on the page deleted.
    //     }
    // } 
    if (confirm('are you sure?')) {
        // remove item from Dom
        item.remove()
        // remove item from storage
        removeItemFromStorage(item.textContent)
        checkUI()
    }
}
// remove item from storage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item) // brings out a new array of the filtered items
    //  reset from local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function clearItem() { // we want to remove the list items using clear all button.
    while (itemList.firstChild) { // here as long as the item list has a first child, we are going to remove it
        itemList.removeChild(itemList.firstChild)
    }
    // clear from local storage 
    localStorage.removeItem('items');
    checkUI() // here theres nothing to filter and clear so we both remove them

}

// FILTERING ITEMS - so that every time we try to filter something, it gets narrowed down
function filterItem(e) { // this is going to run in real time
    const items = document.querySelectorAll('li') // we do this to have access to the items
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        // console.log(itemName)
   
        if(itemName.indexOf(text) != -1) { // to match item to text, we re checking to see if the letter we want to filter is contained in the item list
            // console.log(true)
            item.style.display = 'flex' // here if the letter or text is found in the list item, it is going to remain on the page
        } else {
            // console.log(false)
            item.style.display = 'none' // if it doesnt contain the text, it is going to disappear
        }
    })
}

// to check whether the item exists- prevnt dulpicate items
function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item)
}
// Clear UI state - just making sure that everything is cleared after removing all items
function checkUI() {
    // to clear the input when the values are rest 
    itemInput.value = '';
    const items = document.querySelectorAll('li') // we have put this here because everytime we add an item, we want to keep it in this function
    console.log(items)
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none'
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    // reset the items to edit here
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add item';
    formBtn.style.backgroundColor = '#333'
    isEditMode = false
}

// initialize app
function init () {
    // Event Listeners
    // itemForm.addEventListener('submit', addItem)
    itemForm.addEventListener('submit', onAddItemSubmit)
    // using Event delegetation - event listeners
    // itemList.addEventListener('click', removeItem)
    itemList.addEventListener('click', onClickItem)

    clearBtn.addEventListener('click', clearItem)
    itemFilter.addEventListener('input', filterItem)
    document.addEventListener('DOMContentLoaded', displayItems)

    checkUI();
}
init()

// LOCAL-STORAGE AND SESSION-STORAGE
// here data is stored in the browser and stored as key/value pairs and the values are strings
// localStorage doesnt expire while sessionStorage only lasts until the page is closed
// localStorage.setItem('name', 'cathy')
// console.log(localStorage.getItem('name'))
// // localStorage.removeItem('name', 'cathy')
// localStorage.clear()
// localStorage is not good for sensitive data