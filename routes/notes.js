const notes = require("express").Router();
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
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

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uniqid('note-taker-'),
        };

        readAndAppend(newNote, "./db/db.json");
        res.json("Note added successfully 🚀");
        console.log("Note added successfully 🚀");
    } else {
        res.error("Error adding note 👎");
        console.log("Error adding note 👎");
    }
});


module.exports = notes;
