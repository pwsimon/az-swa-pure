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
	fetch(document.location.origin + "/.auth/me")
		.then(response => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then(data => {
			console.log("User Roles:", data.clientPrincipal?.userRoles);
		})
		.catch(error => {
			console.error("Error fetching user info:", error);
		});
});