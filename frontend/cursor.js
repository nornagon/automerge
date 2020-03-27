
class Cursor {
  constructor(ref, elemId) {
    this.ref = ref
    this.elemId = elemId
  }

  get index() {
    // TODO: how do we get access to the elemIds here?
    return 0
  }
}



module.exports = { Cursor }