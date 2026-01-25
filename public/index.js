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