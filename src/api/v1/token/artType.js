const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK: 400,
  isThisType(type) {
    for (const k in this) {
      if (type == this[k]) return true
    }
    return false;
  }
}
module.exports = ArtType;