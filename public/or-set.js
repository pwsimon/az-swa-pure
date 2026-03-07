export default class ORSet {
  constructor(nodeId) {
    this.nodeId = nodeId;        // eindeutige ID dieser Instanz
    this.adds = new Map();       // Map<Name, Set<Tag>>
    this.removes = new Set();    // Set<Tag>
  }

  // eindeutige Tag-ID erzeugen
  _createTag() {
    return `${this.nodeId}-${Date.now()}-${Math.random()}`;
  }

  add(value) {
    const tag = this._createTag();

    if (!this.adds.has(value)) {
      this.adds.set(value, new Set());
    }

    this.adds.get(value).add(tag);
  }

  remove(value) {
    const tags = this.adds.get(value);
    if (!tags) return;

    for (const tag of tags) {
      this.removes.add(tag);
    }
  }

  // aktueller sichtbarer Zustand
  values() {
    const result = [];

    for (const [value, tags] of this.adds.entries()) {
      const aliveTags = [...tags].filter(tag => !this.removes.has(tag));
      if (aliveTags.length > 0) {
        result.push(value);
      }
    }

    return result;
  }

  // Merge zweier OR-Sets
  merge(other) {
    // adds mergen
    for (const [value, tags] of other.adds.entries()) {
      if (!this.adds.has(value)) {
        this.adds.set(value, new Set());
      }
      for (const tag of tags) {
        this.adds.get(value).add(tag);
      }
    }

    // removes mergen
    for (const tag of other.removes) {
      this.removes.add(tag);
    }
  }
}