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

routen (authentication) hinzufuegen & configurieren (admin, ...)

## Deployment (Productive)

damit wir das real/produktiv Testen können müssen wir es nach Azure Deployen.
Wir verwenden dazu die "xxxxxxx" Subscription und eine "(GitHub) pwsimon" CI/CD Workflow/Pipeline.

## wir machen ein push nach GitHub (pwsimon)

```
git remote add origin https://github.com/pwsimon/az-swa-pure.git
git branch -M main
git push -u origin main
```

## wir erezeugen eine Azure Static App mit der VSCode Extension

- die `.github/workflows/azure-static-web-apps-lively-rock-023c0931e.yml` fuehrt das Deployment aus