import express from "express";
import { Request, Response } from "express";
import { ParsedQs } from "qs";

// helper
function ensureString(
	value: string | ParsedQs | (string | ParsedQs)[] | undefined
): string | undefined {
	if (typeof value === "string") {
		return value;
	}

	if (Array.isArray(value)) {
		const first = value[0];
		return typeof first === "string" ? first : undefined;
	}

	return undefined;
}

// business logic
const mapFavorites = new Map<string, object>([
	[ "client-s", {"adds":{"peter (client-s)":["client-s-1773168899550-0.5761163788515872"]},"removes":[]} ]
]);

const app = express();

// Middleware zum Parsen von JSON und Formulardaten
app.use(express.json());

// Diese Route ist NICHT mehr erreichbar sobald die Azure Static Web App mit diesem Azure App Service verknuepft wurde!
// Begruendung:
// Da die Azure Static Web App die Route "/" bereits belegt.
// Sobald die Verknuepfung mit der Azure Static Web App hergestellt ist, wird die Route "/" von der Azure Static Web App bedient und nicht mehr von diesem Express-Server.
// Daher ist diese Route nur erreichbar, solange die Azure Static Web App nicht mit diesem Azure App Service verknuepft ist.
app.get("/", (req: Request, res: Response) => {
	res.send("Hello az-SWA-pure");
});

// API-Route built/coded for: Azure Authorization using middleware Easy Auth
// 1.) direct als Azure Web Service ohne Azure Static Web App.
// 2.) indirect via. Azure Static Web App.
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

// buisiness-API (OR-Set)
app.get("/api/favorites/:clientId", (req: Request, res: Response) => {
	// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes#route_parameters
	const clientId = ensureString(req.params.clientId);
	if (!clientId)
		return res.status(400).send("Bad Request");
	res.send(mapFavorites.get(clientId));
});
app.post("/api/favorites/:clientId", (req: Request, res: Response) => {
	const clientId = ensureString(req.params.clientId);
	if (!clientId)
		return res.status(400).send("Bad Request");
	mapFavorites.set(clientId, req.body);
});

// der Port: 7071 ist der default port fuer die: azure functions core tools
// siehe auch: Static Web Apps CLI
const port = process.env.PORT || 7071;
app.listen(port, () => {
	console.log(`Server läuft auf http://localhost:${port}`);
});
