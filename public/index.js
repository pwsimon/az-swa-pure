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
	document.getElementById("btnSetNodeId").addEventListener("click", (event) => {
		// console.log("btnSetNodeId::click()");
		window.localStorage.setItem("nodeId", document.getElementById("edtNodeId").value);
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