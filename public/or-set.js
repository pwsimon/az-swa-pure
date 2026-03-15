/*
* 1.) unter zu-hilfenahme von: alt/neu
*  neu     =>   alt
* 1, 2, 3      1, 2   = 1, 2, 3  // 3 ist neu
* 1, 3         1, 2   = 1, 3     // 3 ist neu, 2 ist deleted
*
* 2.) einfache differenz
*   A    DIFF    B
* 1, 2, 3      1, 2   = 3        // 3
* 1, 3         1, 2   = 2, 3     // 2, 3
*/
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
			if (aliveTags.length > 0)
				result.push(value);
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

	stringify() {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
		return JSON.stringify({
			adds: Object.fromEntries(
				[...this.adds.entries()].map(([k, v]) => [k, [...v]])
			),
			removes: [...this.removes]
			});
	}

	static fromJSON(json, nodeId) {
		const obj = typeof json === "string" ? JSON.parse(json) : json;
		const set = new ORSet(nodeId);

		// adds rekonstruieren
		for (const [value, tags] of Object.entries(obj.adds)) {
			set.adds.set(value, new Set(tags));
		}

		// removes rekonstruieren
		set.removes = new Set(obj.removes);
		return set;
	}

}