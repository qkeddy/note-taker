let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

/**
 * If on the notes endpoint, then search for the following elements
 */
if (window.location.pathname === "/notes") {
    noteTitle = document.querySelector(".note-title");
    noteText = document.querySelector(".note-textarea");
    saveNoteBtn = document.querySelector(".save-note");
    newNoteBtn = document.querySelector(".new-note");
    noteList = document.querySelectorAll(".list-container .list-group");
}

/**
 * ! Function to show an element
 * @param {object} elem
 * @returns {void} Nothing
 */
const show = (elem) => (elem.style.display = "inline");

/**
 * ! Function to hide an element
 * @param {object} elem
 * @returns {void} Nothing
 */
const hide = (elem) => (elem.style.display = "none");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

/**
 * ! GET notes from storage
 * @returns
 */
const getNotes = () =>
    fetch("/api/notes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

/**
 * ! POST a note to storage
 * @param {*} note
 * @returns
 */
const saveNote = (note) =>
    fetch("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });

/**
 * ! DELETE a note from storage
 * @param {string} note_id
 * @returns {void} Nothing
 */
const deleteNote = (note_id) =>
    fetch(`/api/notes/${note_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

/**
 * ! Handler to render active notes.
 * ! If there is a note ID, then set the relevant HTML fields.
 * ! If there is not an active note ID, then
 * @returns {void} Nothing
 */
const renderActiveNote = () => {
    hide(saveNoteBtn);

    if (activeNote.note_id) {
        console.log(`Rendering active note ID ${activeNote.note_id} 📣`);
        noteTitle.setAttribute("readonly", true);
        noteText.setAttribute("readonly", true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;
    } else {
        console.log("Clearing note fields for a new note 🆑");
        noteTitle.removeAttribute("readonly");
        noteText.removeAttribute("readonly");
        noteTitle.value = "";
        noteText.value = "";
    }
};

/**
 * ! Handler to create a newNote object and then POST to the API.
 * ! Once the call back is complete then render the full list of notes
 * ! and the active note.
 * @returns {void} Nothing
 */
const handleNoteSave = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value,
    };
    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

/**
 * ! Handler for deleting a note. Gets the data-note attribute, sets its value to an empty object
 * !and then rerenders the list of notes and the active note.
 * @param {object} event
 * @returns {void} Nothing
 */
const handleNoteDelete = (event) => {
    // Prevents the click listener for the list from being called when the button inside of it is clicked
    event.stopPropagation();

    const note = event.target;
    const noteId = JSON.parse(note.parentElement.getAttribute("data-note")).note_id;

    if (activeNote.note_id === noteId) {
        activeNote = {};
    }

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

/**
 * ! Handler to set the activeNote and displays it with the data in the data-note attribute
 * @param {object} event
 * @returns {void} Nothing
 */
const handleNoteView = (event) => {
    // Prevent the default behavior as the event will be explicitly handled
    event.preventDefault();

    activeNote = JSON.parse(event.target.parentElement.getAttribute("data-note"));
        console.log(`Activated a note ${activeNote.note_id} 🎯`);

    renderActiveNote();
};

/**
 * ! Handler for setting the activeNote to an empty object and allows the user to enter a new note
 * @param {object} event
 * @returns {void} Nothing
 */
const handleNewNoteView = (event) => {
    // Prevent the default behavior as the event will be explicitly handled
    event.preventDefault();

    console.log("Creating a new note 📝");

    activeNote = {};
    renderActiveNote();
};

/**
 * ! Handler for the save button
 * @returns {void} Nothing
 */
const handleRenderSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
        hide(saveNoteBtn);
    } else {
        show(saveNoteBtn);
    }
};

/**
 * ! Render the list of note titles
 * ! Uses an asynchronous read and load of the data in the notes object
 * @param {object} notes
 * @returns {void} Nothing
 */
const renderNoteList = async (notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === "/notes") {
        noteList.forEach((el) => (el.innerHTML = ""));
    }

    let noteListItems = [];

    // Returns HTML element with or without a delete button
    const createLi = (text, delBtn = true) => {
        const liEl = document.createElement("li");
        liEl.classList.add("list-group-item");

        const spanEl = document.createElement("span");
        spanEl.classList.add("list-item-title");
        spanEl.innerText = text;
        spanEl.addEventListener("click", handleNoteView);

        liEl.append(spanEl);

        if (delBtn) {
            const delBtnEl = document.createElement("i");
            delBtnEl.classList.add("fas", "fa-trash-alt", "float-right", "text-danger", "delete-note");
            delBtnEl.addEventListener("click", handleNoteDelete);

            liEl.append(delBtnEl);
        }

        return liEl;
    };

    if (jsonNotes.length === 0) {
        noteListItems.push(createLi("No saved Notes", false));
    }

    jsonNotes.forEach((note) => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);

        noteListItems.push(li);
    });

    if (window.location.pathname === "/notes") {
        noteListItems.forEach((note) => noteList[0].append(note));
    }
};

/**
 * ! Gets notes from the db and renders them to the sidebar. Uses getNotes promise and
 * ! then passes notes object to renderNotesList
 * @returns {void} Nothing
 */
const getAndRenderNotes = () => getNotes().then(renderNoteList);

/**
 * If on the notes endpoint, then set events listeners for the following elements.
 */
if (window.location.pathname === "/notes") {
    saveNoteBtn.addEventListener("click", handleNoteSave);
    newNoteBtn.addEventListener("click", handleNewNoteView);
    noteTitle.addEventListener("keyup", handleRenderSaveBtn);
    noteText.addEventListener("keyup", handleRenderSaveBtn);
}

// Invoke the function to get and render the notes
getAndRenderNotes();
