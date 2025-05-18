

## How can I edit this code?

There are several ways of editing your application.


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/le-arch/tastehealth-application.git

# Step 2: Navigate to the project directory.
cd tastehealth-application

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

✅ 1. Prepare Your React App
Make sure your app is production-ready:

Build works: npm run build or yarn build

package.json has a valid build script:

json
```sh
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build"
}
```
✅ 2. Push Your Code to GitHub (or GitLab/Bitbucket)
If it's not already version-controlled:

bash
```sh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```
✅ 3. Sign in to Vercel
Go to [https://vercel.com]

Sign in with GitHub/GitLab/Bitbucket

Click "New Project"

✅ 4. Import Your Repository
Select the repository containing your React app

Vercel auto-detects React and sets:
```
Framework: Create React App

Build Command: npm run build (or yarn build)

Output Directory: build/

Click Deploy.
```

✅ 5. Done! 🎉
Your app will be deployed and live at a vercel.app domain, like:

arduino
```
https://your-app-name.vercel.app
```
You can set a custom domain in the project settings.



