const notes = require("express").Router();
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils");
const uniqid = require("uniqid");

/**
 * ! GET Route for retrieving all the notes
 * @returns {void} Nothing
 */
notes.get("/", (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

/**
 * ! POST Route for a new note
 * @returns {void} Nothing
 */
notes.post("/", (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uniqid("note-taker-"),
        };

        readAndAppend(newNote, "./db/db.json");
        res.json("Note added successfully 🚀");
        console.log("Note added successfully 🚀");
    } else {
        //res.error("Error adding note 👎");
        // This is the proper way to handle an invalid post using the method on the res object. Will not this message in a browser and only in a client like Insomina.
        res.status(400).send("Error adding note 👎");
        console.log("Error adding note 👎");
    }
});

/**
 * ! DELETE Route for a new note
 * @returns {void} Nothing
 */
notes.delete("/:note_id", (req, res) => {
    console.info(`${req.method} request received to delete a note`);
    const noteId = req.params.note_id;

    // Read from file
    readFromFile("./db/db.json")
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all tips except the one with the ID provided in the URL
            const filteredNotes = json.filter((note) => note.note_id !== noteId);
            // console.log(filteredNotes);

            // Save that array to the filesystem
            writeToFile("./db/db.json", filteredNotes);

            // Respond to the DELETE request
            res.json(`Note ${noteId} has been deleted 🚫`);
            console.log(`Note ${noteId} has been deleted 🚫`);
        });
});

/**
 * ! PUT Route for editing a note
 * @returns {void} Nothing
 */
notes.put("/:note_id", (req, res) => {
    console.info(`${req.method} request received to update a note`);
    const noteId = req.params.note_id;

    // Read from file
    readFromFile("./db/db.json")
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all tips except the one with the ID provided in the URL
            const updatedNotes = json.map((note) => {
                if (note.note_id === noteId) {
                    note.title = req.body.title;
                    note.text = req.body.text;
                }
                return note;
            });
            // console.log(updatedNotes);

            // Save that array to the filesystem
            writeToFile("./db/db.json", updatedNotes);

            // Respond to the DELETE request
            res.json(`Note ${noteId} has been updated ⬆️`);
            console.log(`Note ${noteId} has been updated ⬆️`);
        });
});

module.exports = notes;
