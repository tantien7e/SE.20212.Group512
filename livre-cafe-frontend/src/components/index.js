var collection = {
  '2548': {
    album: 'Slippery when met',
    artist: 'Bon Jovi',
    track: ['Let it Rock', 'You give love a bad name'],
  },
};
var collectionCopy = JSON.parse(JSON.stringify(collection));

function updateRecord(id, prop, value) {
  if (value == '') {
    delete collection[id][prop];
  } else if (prop === 'track') {
    collection[id][prop] = collection[id][prop] || [];
    collection[id][prop].push(value);
  } else {
    collection[id][prop] = value;
  }
  return collection;
}

console.log(updateRecord('2548', 'artirst', 'Allabama'));
console.log(collection['2548']['artist']);
