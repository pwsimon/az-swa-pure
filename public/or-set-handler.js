import CORSet from "./or-set.js";

window.addEventListener("load", () => {
	const persist = JSON.parse(window.localStorage.getItem("favorites"));
	const mySet = persist ? CORSet.fromJSON(persist, "client-a") : new CORSet("client-a");
	const htmlList = document.getElementById("list");

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
	document.getElementById("btnPush").addEventListener("click", (event) => {
		window.localStorage.setItem("favorites", mySet.stringify());
	});
});