const _ = require('lodash');
const models = require('./models');

function calculateSearchMeaning(selectedRackOrFolder, searchInput) {
  var words = searchInput.toLowerCase().split(' ');
  var folderUids;
  if (selectedRackOrFolder === null) {
    folderUids = null;
  } else if (selectedRackOrFolder instanceof models.Rack) {
    folderUids = selectedRackOrFolder.folders.map((f) => {return f.uid});
  } else {
    folderUids = [selectedRackOrFolder.uid]
  }

  return {
    folderUids: folderUids,
    words: words
  };
}

function allWords(text, words) {
  /**
   * allWords("Hello Goodbye", ["ell", "oo"]) => true
   * allWords("Hi Goodbye", ["ell", "oo"]) => false
   */
  return _.all(_.map(words, (word) => { return _.includes(text, word) }))
}

function searchNotes(selectedRackOrFolder, searchInput, notes) {
  var searchPayload = calculateSearchMeaning(selectedRackOrFolder, searchInput);
  return notes.filter((note) => {
    return (!searchPayload.folderUids || _.includes(searchPayload.folderUids, note.folderUid)) &&
      (searchPayload.words.length == 0 || allWords(note.body.toLowerCase(), searchPayload.words))
  });
}

module.exports = {
  searchNotes: searchNotes,
  calculateSearchMeaning: calculateSearchMeaning
};
