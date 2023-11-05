function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }

  return sorted;
}
function decodeObject(obj) {
  let decoded = {};
  let key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(obj[key]).replace(/\+/g, ' ');
      decoded[decodedKey] = decodedValue;
    }
  }

  return decoded;
}
module.exports = { sortObject, decodeObject };
