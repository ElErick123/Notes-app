const noteContainer = document.getElementById("note-container");
const addPopUp = document.getElementById("add-pop-up");
const popUpOverlay = document.getElementById("overlay");
const createNoteButton = document.getElementById("create-note-button");
const nameInput = document.getElementById("name-input");
const contentInput = document.getElementById("content-input");
const colorSelection = document.getElementsByName("color-swatch");
const savedNotes = JSON.parse(localStorage.getItem("notes")) || []
let notesArray = [];

if (localStorage !== null) {
    for (const note of savedNotes) {
        noteContainer.innerHTML += `
        <div class="note" style="background-color: ${note.color};">
            <h3>${note.name}</h3>
            <p>${note.content}</p>
            <div id="note-icons">
                <button class="note-button" id="edit-note-button"><i class="fa-solid fa-pen"></i></button>
                <button class="note-button" id="delete-note-button"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
        `
    }
}

const showPopUp = () => {
    addPopUp.style.display = "block";
    popUpOverlay.style.display = "block";
}

const hidePopUp = () => {
    addPopUp.style.display = "none";
    popUpOverlay.style.display = "none";
    nameInput.classList.remove("empty-value");
    nameInput.placeholder = "Name of your note";
    nameInput.value = "";
    contentInput.value = "";
    colorSelection[0].checked = true;
}

const addNote = () => {
    if (!nameInput.value) {
        nameInput.classList.add("empty-value");
        nameInput.placeholder = "Please fill in this space!";
        return;
    }
    let selectedColor;
    for (const color of colorSelection) {
        if (color.checked) {
            selectedColor = color.value;
            break;
        }
    }
    let note = {
        name: nameInput.value,
        content: contentInput.value,
        color: selectedColor
    }
    notesArray = savedNotes;
    notesArray.push(note);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    hidePopUp();
    noteContainer.innerHTML += `
    <div class="note" style="background-color: ${note.color};">
        <h3>${note.name}</h3>
        <p>${note.content}</p>
        <div id="note-icons">
            <button class="note-button" id="edit-note-button"><i class="fa-solid fa-pen"></i></button>
            <button class="note-button" id="delete-note-button"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    </div>
    `;
}