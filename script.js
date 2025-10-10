const noteContainer = document.getElementById("note-container");
const addPopUp = document.getElementById("add-pop-up");
const deletePopUp = document.getElementById("delete-pop-up");
const confirmDeleteButton = document.getElementById("confirm-delete");
const cancelDeleteButton = document.getElementById("cancel-delete")
const popUpOverlay = document.getElementById("overlay");
const createNoteButton = document.getElementById("create-note-button");
const nameInput = document.getElementById("name-input");
const contentInput = document.getElementById("content-input");
const colorSelection = document.getElementsByName("color-swatch");
const savedNotes = JSON.parse(localStorage.getItem("notes")) || []
let notesArray = [...savedNotes];

if (localStorage !== null) {
    for (const note of savedNotes) {
        const formattedContent = note.content.replace(/\n/g, '<br>');
        noteContainer.innerHTML += `
        <div class="note" id="${note.id}" style="background-color: ${note.color};" onclick="focusNote(this)">
            <h3>${note.name}</h3>
            <p>${formattedContent}</p>
            <div id="note-icons">
                <button class="note-button" id="edit-note-button" onclick="event.stopPropagation(); editNote(this.parentElement.parentElement, ${note.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="note-button" id="delete-note-button" onclick="event.stopPropagation(); showPopUp('delete-pop-up', ${note.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
        `
    }
}

const showPopUp = (popUp, noteID) => {
    if (popUp === "add-pop-up") {
        addPopUp.classList.add("add-pop-up-active");
        popUpOverlay.style.display = "block";
    }
    else if (popUp === "delete-pop-up") {
        deletePopUp.classList.add("delete-pop-up-active");
        confirmDeleteButton.setAttribute("onclick", `deleteNote(${noteID})`);
        popUpOverlay.style.display = "block";
    }
    else {
        alert("Something went wrong.")
    }
}

const hidePopUp = (popUp) => {
    addPopUp.classList.remove("add-pop-up-active");
    popUpOverlay.style.display = "none";
    nameInput.classList.remove("empty-value");
    nameInput.placeholder = "Name of your note";
    nameInput.value = "";
    contentInput.value = "";
    colorSelection[0].checked = true;
    deletePopUp.classList.remove("delete-pop-up-active");
    popUpOverlay.style.display = "none";
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
        id: Date.now(),
        name: nameInput.value,
        content: formattedContent,
        color: selectedColor
    }
    notesArray.push(note);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    hidePopUp();
    noteContainer.innerHTML += `
    <div class="note" id=${note.id} style="background-color: ${note.color};" onclick="focusNote(this)">
        <h3>${note.name}</h3>
        <p>${note.content}</p>
        <div id="note-icons">
            <button class="note-button" id="edit-note-button" onclick="event.stopPropagation(); editNote(this.parentElement.parentElement, ${note.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="note-button" id="delete-note-button" onclick="event.stopPropagation(); showPopUp('delete-pop-up', ${note.id})"><i class="fa-solid fa-trash-can"></i></button>
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

const editNote = (note, id) => {
    const editNote = note.cloneNode(true);
    editNote.classList.remove("note");
    editNote.classList.add("edit-note");
    editNote.removeAttribute("onclick");
    const noteName = note.querySelector("h3").textContent;
    const noteContent = note.querySelector("p").innerHTML.replace(/<br>/g, "\n");
    editNote.innerHTML = `
    <input type="text" value="${noteName}" id="edit-note-name" spellcheck="false">
    <textarea id="edit-note-content" rows=8 spellcheck="false">${noteContent}</textarea>
    <button id="done-edit-button">Done</button>
    `;
    document.body.appendChild(editNote);
    editNote.offsetHeight;
    editNote.classList.add("new-note-active");
    popUpOverlay.style.display = "block";


    editNote.querySelector("button").addEventListener("click", function () {
        const noteIndex = notesArray.findIndex(note => note.id === id);
        const nameToChange = editNote.querySelector("#edit-note-name").value;
        const contentToChange = editNote.querySelector("#edit-note-content").value;

        if (!nameToChange) {
            alert("Please provide a name");
            return;
        }
        note.querySelector("h3").innerText = nameToChange;
        note.querySelector("p").innerText = contentToChange;

        if (noteIndex === -1) {
            alert("Something went wrong.");
            return;
        }
        notesArray[noteIndex].name = nameToChange;
        notesArray[noteIndex].content = contentToChange;

        localStorage.setItem("notes", JSON.stringify(notesArray));
        unfocusNote();
        popUpOverlay.style.display = "none";
    });
}

popUpOverlay.addEventListener("click", unfocusNote);

const deleteNote = (id) => {
    const noteIndex = notesArray.findIndex(note => note.id === id);
    if (noteIndex === -1) {
        alert("Something went wrong.");
        return;
    }
    const noteElement = document.getElementById(id);
    if (noteElement) {
        noteElement.remove();
    }
    notesArray.splice(noteIndex, 1);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    hidePopUp();
}