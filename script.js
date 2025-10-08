const noteContainer = document.getElementById("note-container");
const addPopUp = document.getElementById("add-pop-up");
const popUpOverlay = document.getElementById("overlay");
const createNoteButton = document.getElementById("create-note-button");
const nameInput = document.getElementById("name-input");
const contentInput = document.getElementById("content-input");
const colorSelection = document.getElementsByName("color-swatch");
const savedNotes = JSON.parse(localStorage.getItem("notes")) || []
let notesArray = [...savedNotes];
const note = document.querySelectorAll(".note");

if (localStorage !== null) {
    for (const note of savedNotes) {
        noteContainer.innerHTML += `
        <div class="note" style="background-color: ${note.color};" onclick="focusNote(this)">
            <h3>${note.name}</h3>
            <p>${note.content}</p>
            <div id="note-icons">
                <button class="note-button" id="edit-note-button" onclick="event.stopPropagation(); editNote(this.parentElement.parentElement)"><i class="fa-solid fa-pen"></i></button>
                <button class="note-button" id="delete-note-button" onclick="event.stopPropagation(); editNote(this.parentElement.parentElement)"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
        `
    }
}

const showPopUp = () => {
    addPopUp.classList.add("add-pop-up-active");
    popUpOverlay.style.display = "block";
}

const hidePopUp = () => {
    addPopUp.classList.remove("add-pop-up-active");
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
    const formattedContent = contentInput.value.replace(/\n/g, '<br>');
    let note = {
        name: nameInput.value,
        content: formattedContent,
        color: selectedColor
    }
    notesArray.push(note);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    hidePopUp();
    noteContainer.innerHTML += `
    <div class="note" style="background-color: ${note.color};" onclick="focusNote(this)">
        <h3>${note.name}</h3>
        <p>${note.content}</p>
        <div id="note-icons">
            <button class="note-button" id="edit-note-button" onclick="event.stopPropagation(); editNote(this.parentElement.parentElement)"><i class="fa-solid fa-pen"></i></button>
            <button class="note-button" id="delete-note-button" onclick="event.stopPropagation(); editNote(this.parentElement.parentElement)"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    </div>
    `;
}

const focusNote = (note) => {
    const newNote = note.cloneNode(true);
    newNote.classList.remove("note");
    newNote.classList.add("new-note");
    newNote.removeAttribute("onclick");
    const iconsDiv = newNote.querySelector("#note-icons");
    iconsDiv.remove();
    document.body.appendChild(newNote);
    newNote.offsetHeight;
    newNote.classList.add("new-note-active");
    popUpOverlay.style.display = "block";
}

const unfocusNote = () => {
    const activeNote = document.querySelector(".new-note-active");
    activeNote.classList.remove("new-note-active");
    setTimeout(() => {
        activeNote.remove();
    }, 300);
};

popUpOverlay.addEventListener("click", unfocusNote);