const assert = require('assert')
const Automerge = process.env.TEST_DIST === '1' ? require('../dist/automerge') : require('../src/automerge')

describe('a cursor', () => {
  let s1, s2
  beforeEach(() => {
    s1 = Automerge.change(Automerge.init(), doc => doc.text = new Automerge.Text())
    s2 = Automerge.merge(Automerge.init(), s1)
  })

  it('is creatable and readable', () => {
    s1 = Automerge.change(s1, doc => {
      doc.cursor = doc.text.cursorAt(0)
    })
    assert.strictEqual(s1.cursor.index, 0)
  })

  it('can be created outside of a change block', () => {
    const cursor = s1.text.cursorAt(0)
    assert.strictEqual(cursor.index, 0)
  })

  it('should have its index change when a character is inserted before it', () => {
    let doc = Automerge.change(Automerge.from({text: new Automerge.Text('hello')}), d => {
      d.cursor = d.text.cursorAt(2)
    })
    assert.strictEqual(doc.cursor.index, 2)
    doc = Automerge.change(doc, d => {
      d.text.insertAt(1, 'i')
    })
    assert.strictEqual(doc.cursor.index, 3)
  })

  it('should not have its index change a character is inserted after it', () => {
    let doc = Automerge.change(Automerge.from({text: new Automerge.Text('hello')}), d => {
      d.cursor = d.text.cursorAt(2)
    })
    assert.strictEqual(doc.cursor.index, 2)
    doc = Automerge.change(doc, d => {
      d.text.insertAt(3, 'i')
    })
    assert.strictEqual(doc.cursor.index, 2)
  })

  it('should not have its index change when a character is inserted at the same index', () => {
    let doc = Automerge.change(Automerge.from({text: new Automerge.Text('hello')}), d => {
      d.cursor = d.text.cursorAt(2)
    })
    assert.strictEqual(doc.cursor.index, 2)
    doc = Automerge.change(doc, d => {
      d.text.insertAt(2, 'i')
    })
    assert.strictEqual(doc.cursor.index, 2)
  })

  it('should have its index change when a character is deleted before it', () => {
    let doc = Automerge.change(Automerge.from({text: new Automerge.Text('hello')}), d => {
      d.cursor = d.text.cursorAt(2)
    })
    assert.strictEqual(doc.cursor.index, 2)
    doc = Automerge.change(doc, d => {
      d.text.deleteAt(1)
    })
    assert.strictEqual(doc.cursor.index, 1)
  })

  it('should not have its index change when a character is deleted after it', () => {
    let doc = Automerge.change(Automerge.from({text: new Automerge.Text('hello')}), d => {
      d.cursor = d.text.cursorAt(2)
    })
    assert.strictEqual(doc.cursor.index, 2)
    doc = Automerge.change(doc, d => {
      d.text.deleteAt(3)
    })
    assert.strictEqual(doc.cursor.index, 2)
  })

  it('stays valid for a deleted character', () => {
    let doc = Automerge.change(Automerge.from({text: new Automerge.Text('hello')}), d => {
      d.cursor = d.text.cursorAt(2)
    })
    assert.strictEqual(doc.cursor.index, 2)
    doc = Automerge.change(doc, d => {
      d.text.deleteAt(2)
    })
    assert.strictEqual(doc.cursor.index, 2)
  })

  it('should be able to be created at the end of the string', () => {
    let doc = Automerge.change(Automerge.from({text: new Automerge.Text('hello')}), d => {
      d.cursor = d.text.cursorAt(5)
    })
    assert.strictEqual(doc.cursor.index, 5)
  })

  it('throws an error when created with negative index', () => {
    assert.throws(() => s1.text.cursorAt(-1), /negative/)
  })

  it('throws an error when created with index past the end of the string', () => {
    assert.throws(() => s1.text.cursorAt(1), /past/)
  })
})