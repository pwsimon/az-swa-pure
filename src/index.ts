import express from "express";
import { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
	res.send("Hello az-SWA-pure");
});

// API-Route built/coded for: requires authorization using middleware Easy Auth
app.get("/api/authreq", (req: Request, res: Response) => {
	/*
	* [x-ms-client-principal](https://learn.microsoft.com/de-de/azure/static-web-apps/user-information?tabs=javascript#api-functions)
	* Hints:
	* Der x-ms-client-principal-Header, auf den in der API-Funktion zugegriffen werden kann, enthält das claims-Array nicht.
	* Wir sehen hier in: userRoles auch die Rollen, die dem Benutzer per Azure Role Assignment zugewiesen wurden (rollenverwaltung.jpg).
	*/
	const header = req.headers['x-ms-client-principal'] as string;
	if (header.length === 0)
		return res.status(401).send("Unauthorized");

	// decode base64 encoded header
	const encoded = Buffer.from(header, 'base64');
	const decoded = encoded.toString('ascii');
	const clientPrincipal = JSON.parse(decoded);

	// [Retrieve tokens in app code](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-oauth-tokens#retrieve-tokens-in-app-code)
	res.json({ result: "OK", userRoles: clientPrincipal.userRoles, userId: clientPrincipal.userId });
});

// der Port: 7071 ist der default port fuer die: azure functions core tools
// siehe auch: Static Web Apps CLI
const port = process.env.PORT || 7071;
app.listen(port, () => {
	console.log(`Server läuft auf http://localhost:${port}`);
});
