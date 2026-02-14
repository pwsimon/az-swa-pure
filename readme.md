eine Backend API der ein Azure EasyAuth vorgeschalten ist.

produktive wenn es als App Service nach Azure Deployed wird

Local wird das EasyAuth durch den [Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/) bereitgestellt/simuliert.  
Als minimal kriterium/abgrenzung zu [EasyAuthBackend](../EasyAuthBackend/readme.md) / [az-static-app](../az-static-app/README.md) kombination.
stellen wir das Frontend/UI als pure JavaScript/HTML bereit.

# [setup](https://chatgpt.com/c/6975fc86-0390-8333-859b-ba546012f518)

```
mkdir az-swa-pure
cd az-swa-pure
git init
copy .gitignore
npm init -y
npm install express
npm install -D typescript ts-node-dev @types/node @types/express
npx tsc --init
create ./src/index.ts
create ./vscode/launch.json
npm install -D @azure/static-web-apps-cli
npx swa init
git add .
git commit -m "Initiales Node.js Projekt mit TypeScript und Express"
npx swa start
```

# ToDo

Verknüpfen einer Azure App Service-Web-App  
siehe: [API-Unterstützung in Azure Static Web Apps mit Azure App Service](https://learn.microsoft.com/de-de/azure/static-web-apps/apis-app-service)

## Deployment (Productive)

damit wir das real/produktiv Testen können müssen wir es nach Azure Deployen.
Wir verwenden dazu die "xxxxxxx" Subscription und eine "(GitHub) pwsimon" CI/CD Workflow/Pipeline.

## wir machen ein push nach GitHub (pwsimon)

```
git remote add origin https://github.com/pwsimon/az-swa-pure.git
git branch -M main
git push -u origin main
```

Mit dem einrichten der CI/CD GitHub-Action wird ein PAT fuer *Azure* ausgestellt  
und in den [Authorized OAuth Apps](https://github.com/settings/applications) hinterlegt.

Entsprechend loeschen nicht vergessen.

## [Azure Static App (az-swa-pure)](https://orange-rock-03103171e.1.azurestaticapps.net)

aus dem Azure Portal erzeugt.  
wobei wir als das Repository angeben.  
Die Credentials werden benoetigt um:
- das `.github\workflows\azure-static-web-apps-orange-rock-03103171e.yml` zu erzeugen.
- das [Bereitstellungstoken](https://github.com/pwsimon/az-swa-pure/settings/secrets/actions) in den GitHub-EnvironmentValriablen zu speichern (damit ein push autom. ein Deploy ausfuehrt)

### EntraID: (Bitwarden estos/Labor)

- caspar.hauser@servonic.org (authenticated)
- anna.bolika@servonic.org (authenticated, administrator)

## [Azure App Service (az-backend)]()
