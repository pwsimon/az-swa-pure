function doBackendCall() {
	fetch(document.location.origin + "/api/authreq")
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
}
window.addEventListener("load", () => {
	document.getElementById("edtAdd").addEventListener("change", (event) => {
		/*
		* https://developer.mozilla.org/de/docs/Web/API/HTMLSelectElement/add
		document.getElementById("list").add();
		*/
		document.getElementById("list").insertAdjacentHTML("afterbegin", `<option>${event.target.value.trim()}</option>`)
	});
	document.getElementById("btnRemove").addEventListener("click", (event) => {
		const htmlList = document.getElementById("list");
		htmlList.remove(htmlList.selectedIndex);
	});
	fetch(document.location.origin + "/.auth/me")
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(data => {
			console.log("User Roles:", data.clientPrincipal?.userRoles);
			if (data.clientPrincipal?.userRoles.includes("authenticated"))
				document.getElementById("user-link").classList.remove("disabled-link");
			if (data.clientPrincipal?.userRoles.includes("administrator"))
				document.getElementById("admin-link").classList.remove("disabled-link");
		})
		.catch(error => {
			console.error("Error fetching user info:", error);
		});
});