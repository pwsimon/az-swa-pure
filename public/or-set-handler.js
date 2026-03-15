import CORSet from "./or-set.js";

/*
* das `delete` erklaert
*/
function demo() {
	const a = new CORSet("A");
	const b = new CORSet("B");

	a.add("Max"); // der <user> fuegt auf Machine: a den "Max" hinzu
	b.add("Max"); // der (gleiche) <user> fuegt auf Machine: b auch den "Max" hinzu

	a.add("Anna"); // jetzt noch ein (konflikt-freies) add auf Machine: a
	b.add("Lea");  // und ein (konflikt-freies) add auf Machine: b

	// Offline passiert:
	a.remove("Max");

	// Synchronisation:
	a.merge(b);
	b.merge(a);

	/*
	* obwohl der <user> den: "Max" (auf Machine: A) entfernt hat taucht er immer noch auf ...
	* Es kommt noch schlimmer der user hat keinen Hinweis wie (auf welcher Machine: A | B)
	* er den "Max" loeschen muss damit der "Max" wirklich verschwindet ...
	* bzw. was passiert nach einem erneuten `a.remove("Max");` ?
	*/
	console.log(a.values()); // Max, Anna, Lea
	console.log(b.values()); // Max, Anna, Lea

	// jetzt gibt es KEINEN "Max" mehr ...
	// Fazit: ein mehrfaches Add (Max) bekommst du aus User-Sicht nicht intuitiv geloest.
	b.remove("Max");
	console.log(b.values()); // Anna, Lea => OK
}

window.addEventListener("load", () => {
	const nodeId = window.localStorage.getItem("nodeId");
	if (!nodeId) {
		console.warn("needs a nodeId to work ...");
		return;
	}

	document.title = `Backend API using EasyAuth (${nodeId})`;
	const persist = JSON.parse(window.localStorage.getItem("favorites"));
	const htmlList = document.getElementById("list");
	const mySet = persist ? CORSet.fromJSON(persist, nodeId) : new CORSet(nodeId);

	mySet.values().forEach(element => {
		htmlList.insertAdjacentHTML("afterbegin", `<option>${element}</option>`)
	});

	document.getElementById("edtAdd").addEventListener("change", (event) => {
		const newValue = event.target.value.trim();

		if(newValue.length > 0) {
			mySet.add(newValue);
			htmlList.options.length = 0; // Removes all options
			mySet.values().forEach(element => {
				htmlList.insertAdjacentHTML("afterbegin", `<option>${element}</option>`)
			});
			event.target.value = "";
		}
	});
	document.getElementById("btnRemove").addEventListener("click", (event) => {
		const removeValue = htmlList[htmlList.selectedIndex];
		mySet.remove(removeValue.value);
		htmlList.options.length = 0; // Removes all options
		mySet.values().forEach(element => {
			htmlList.insertAdjacentHTML("afterbegin", `<option>${element}</option>`)
		});
	});
	document.getElementById("btnSave").addEventListener("click", (event) => {
		window.localStorage.setItem("favorites", mySet.stringify());
	});
	document.getElementById("btnMerge").addEventListener("click", (event) => {
		const nodeId2Merge = document.getElementById("edtNodeId").value;
		fetch(document.location.origin + `/api/favorites/${nodeId2Merge}`)
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(data => {
			const set2Merge = CORSet.fromJSON(data, nodeId2Merge);
			mySet.merge(set2Merge);
			htmlList.options.length = 0; // Removes all options
			mySet.values().forEach(element => {
				htmlList.insertAdjacentHTML("afterbegin", `<option>${element}</option>`)
			});
		})
		.catch(error => {
			console.error("Error calling backend:", error);
		});
	});
	document.getElementById("btnPush").addEventListener("click", (event) => {
		fetch(document.location.origin + `/api/favorites/${nodeId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: mySet.stringify()
		})
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(data => {
			console.log("Backend response:", data);
		})
		.catch(error => {
			console.error("Error calling backend:", error);
		});
	});
	// demo();
});