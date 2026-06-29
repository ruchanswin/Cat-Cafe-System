# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# 🐱 Cat Café Rescue Web App

**COS30043 – Interface Design and Development**
Group Project using **Vue 3 + Vite + Vue Router**

---

## 📌 Project Overview

This project is a group-built modern web application based on a **Cat Café + Rescue** concept.

The website is designed to combine:

* a cat café experience
* rescue cat profiles
* booking and reservations
* adoption support
* donations
* reviews
* admin management

The purpose of this repository is to give the whole team **one shared codebase** with:

* consistent styles
* reusable components
* a common layout
* shared data structure
* a safe workflow for collaboration

This helps us make sure the final website feels like **one complete app** instead of six separate mini-projects.

---

## 🎯 Main Team Goals

When working on this project, we want to make sure that:

* all pages look visually consistent
* all teammates follow the same layout structure
* shared styles are reused instead of rewritten
* pages can be built individually without breaking the overall app
* all changes are reviewed before going into `main`

---

## 🛠 Tech Stack

This project uses:

* **Vue 3**
* **Vite**
* **Vue Router**
* **CSS**
* **Git + GitHub**

Later we may also add:

* Bootstrap grid
* backend/API
* database integration

---

## 📁 Project Structure

```text
src/
  components/
    layout/
      AppNavbar.vue
      AppFooter.vue
      PageLayout.vue
    ui/
      AppButton.vue
      AppCard.vue
      AppContainer.vue
      PageHeader.vue
  router/
    index.js
  views/
    TestView.vue
  App.vue
  main.js
  style.css
```

---

## 📂 What Each Folder/File Is For

### `src/components/layout/`

This folder contains the main shared page wrappers.

#### `AppNavbar.vue`

The top navigation bar shown across the site.

#### `AppFooter.vue`

The footer shown at the bottom of every page.

#### `PageLayout.vue`

This wraps each page so that all pages automatically use the same navbar, footer, and page structure.

---

### `src/components/ui/`

This folder contains small reusable UI pieces.

#### `AppButton.vue`

Reusable button component.
Use this instead of creating random new button styles.

#### `AppCard.vue`

Reusable card wrapper for cats, reviews, menu items, donations, etc.

#### `AppContainer.vue`

Reusable content wrapper for consistent width and spacing.

#### `PageHeader.vue`

Reusable page title + subtitle section for every page.

---

### `src/views/`

This folder contains full page views.

Each main page should live here.

Examples later may include:

* `HomeView.vue`
* `CatsView.vue`
* `MenuView.vue`
* `BookingView.vue`
* `DonationsView.vue`
* `ReviewsView.vue`

Right now we have:

* `TestView.vue` → used for testing the shared layout system

---

### `src/router/index.js`

This controls page navigation using Vue Router.

Every time we add a new page, we also need to add a route here.

---

### `src/main.js`

This is the app entry point.

It connects:

* Vue
* App.vue
* Router
* global stylesheet

---

### `src/App.vue`

This currently renders the router using:

```vue
<RouterView />
```

That means the app will show whichever page is currently active.

---

### `src/style.css`

This is our current shared stylesheet.

Right now, this acts as the main shared style file for the project.

Later, if we want, we can split this into:

* `styles/global.css`
* `styles/variables.css`

But for now, keep styles central and consistent.

---

## 🚀 How To Set Up This Project On Your Device

### 1. Install required software

Before doing anything, make sure you have:

* **Git**
* **Node.js**
* **npm**
* a code editor such as **VS Code**

To check if Node and npm are installed, run:

```bash
node -v
npm -v
```

If those commands work, you’re good to go.

If not, install Node.js first.

---

### 2. Clone the repository

```bash
git clone https://github.com/OvySwin/Cat-Cafe-COS30043.git
```

Then enter the project folder:

```bash
cd Cat-Cafe-COS30043
```

---

### 3. Install project dependencies

```bash
npm install
```

This installs everything the project needs, including Vue and Vue Router.

---

### 4. Run the development server

```bash
npm run dev
```

Vite will then show you a local URL, usually something like:

```text
http://localhost:5173/
```

Open that in your browser to view the app.

---

## ⚠️ Important: Always Use the Correct Folder

All commands must be run **inside the project folder**, not the outer folder.

Correct folder:

```text
Cat-Cafe-COS30043
```

Examples of commands that must be run inside the repo folder:

* `npm install`
* `npm run dev`
* `git status`
* `git add .`
* `git commit -m "..."`
* `git push`

If you get errors like:

```text
Could not read package.json
```

that usually means you are in the wrong folder.

---

## 🌿 Git Workflow Rules

### Very important rule:

**Do not push directly to `main`.**

Instead:

* work on your own branch
* commit your work there
* push your branch
* review it with the team
* then merge approved work into `main`

This keeps the main branch clean and stable.

---

## 🔁 Standard Team Workflow

### 1. Start from updated main

Before starting any work:

```bash
git checkout main
git pull origin main
```

---

### 2. Create your own branch

Create a feature branch for your page or task.

Examples:

```bash
git checkout -b home-page
git checkout -b cats-page
git checkout -b booking-page
git checkout -b donations-page
```

Branch names should be clear and related to the page/feature.

---

### 3. Work only on your branch

Do your coding on that branch.

Check changes:

```bash
git status
```

Save work often with commits.

---

### 4. Commit your work regularly

Example:

```bash
git add .
git commit -m "Built booking page layout"
```

Try to commit after meaningful progress, not only once at the very end.

Good commit examples:

* `Created shared layout wrappers`
* `Built cats page card layout`
* `Added booking form structure`
* `Styled donation cards`
* `Added reviews section`
* `Connected menu page to router`

---

### 5. Push your branch

Push your own branch, not `main`.

Example:

```bash
git push origin booking-page
```

This lets the team review your work before it is merged.

---

### 6. Weekly review before merging to main

We will do regular review/check-ins before pushing final approved work into `main`.

This helps us:

* keep the app consistent
* avoid broken code in main
* reduce conflicts
* make sure pages match the shared style system

---

## ✅ Rule Summary For Git

### Do:

* pull latest `main`
* create your own branch
* commit often
* push your branch
* review before merge

### Don’t:

* don’t work directly in `main`
* don’t push directly to `main`
* don’t overwrite shared files without checking
* don’t leave broken code and merge it anyway

---

## 🧱 Shared Layout System

We already have a shared layout system so that everyone’s pages match visually.

### Use this structure for every page:

```vue
<PageLayout>
  <PageHeader
    title="Page Title"
    subtitle="Short page description"
  />

  <AppContainer>
    <!-- page content goes here -->
  </AppContainer>
</PageLayout>
```

This ensures:

* same navbar
* same footer
* same spacing
* same content width
* same overall page structure

---

## 🧩 Shared Components To Use

Please reuse these instead of building your own versions unless necessary.

### `PageLayout`

Use for every page.

### `PageHeader`

Use for page headings and intro text.

### `AppContainer`

Use for wrapping sections and keeping width consistent.

### `AppCard`

Use for cards like:

* cat profiles
* donation items
* menu items
* team member cards
* reviews

### `AppButton`

Use for buttons instead of making different button styles on each page.

---

## 🎨 Styling Rules

To keep the project visually consistent:

* reuse the shared stylesheet
* do not add random new colours unless discussed
* keep button styling consistent
* keep spacing and padding similar across pages
* follow the same page structure
* use the same text tone and style

### Current colour palette

* Primary: `#B65C68`
* Secondary: `#E8A6A1`
* Background / soft tones to match our cat café theme
* Dark text tone: `#4B2C2D`

---

## 📝 How To Add Your Code Properly

### If you are making a page

Put the page in:

```text
src/views/
```

Example:

```text
src/views/CatsView.vue
```

Then add the route in:

```text
src/router/index.js
```

---

### If you are making reusable shared UI

Put it in:

```text
src/components/ui/
```

Examples:

* buttons
* cards
* small reusable form pieces
* page section helpers

---

### If you are changing site-wide layout

Put it in:

```text
src/components/layout/
```

Examples:

* navbar
* footer
* page layout wrapper

Be careful with layout changes because they affect everyone.

---

### If you are changing shared styles

Update:

```text
src/style.css
```

Do not heavily rewrite the shared styling without telling the team first.

---

## 📌 Naming Conventions

Please keep file names clean and consistent.

### Vue components

Use **PascalCase**

Examples:

* `PageHeader.vue`
* `AppButton.vue`
* `CatsView.vue`

Do not mix styles like:

* `pageheader.vue`
* `pageHeader.vue`

Consistency matters, especially for imports.

---

## 📍 Current Base Pages / Test Setup

Right now we are using `TestView.vue` to test the shared app layout.

That page helps us check:

* navbar
* footer
* shared buttons
* shared cards
* shared content spacing
* overall page structure

Once the shared system is stable, we can replace the test setup with real pages.

---

## 📄 Suggested Future Pages

Potential page files we may add:

* `HomeView.vue`
* `TeamView.vue`
* `CatsView.vue`
* `CatDetailsView.vue`
* `MenuView.vue`
* `BookingView.vue`
* `AvailabilityView.vue`
* `AdoptView.vue`
* `ReviewsView.vue`
* `DonationsView.vue`
* `AdminView.vue`

---

## 🧪 Testing Before You Commit

Before committing your work:

* make sure the app still runs
* make sure your page loads without errors
* check browser console for errors
* check layout does not break navbar/footer
* test basic responsiveness
* make sure imports and filenames match exactly

---

## 🚫 Common Mistakes To Avoid

### 1. Running commands in the wrong folder

If npm says it cannot find `package.json`, you are probably in the wrong folder.

### 2. Importing a file that does not exist

Double-check exact file names and capitalization.

### 3. Working directly in main

Always use your own branch.

### 4. Creating random styles for only one page

Try to use shared components and shared styling.

### 5. Renaming shared files without telling the team

This can break other people’s imports.

---

## 🧠 Collaboration Tips

To make teamwork smoother:

* pull latest code before you start
* tell the team which files you are working on
* avoid editing the same shared file at the same time if possible
* commit often
* keep commits small and meaningful
* ask before changing shared layout files
* keep code neat and readable

---

## ✅ Example Personal Workflow

Here is a good example of how one teammate should work:

```bash
git checkout main
git pull origin main
git checkout -b donations-page
npm install
npm run dev
```

Then code their page.

When done:

```bash
git add .
git commit -m "Built donations page layout"
git push origin donations-page
```

Then the team reviews it before it goes into `main`.

---

## 📬 What To Do If Something Breaks

If you get an error:

1. read the error carefully
2. check if the file path exists
3. check if you are in the correct folder
4. check if the filename capitalization matches
5. ask the team before changing shared files blindly

---

## 💖 Final Reminder

The goal is not just to make pages individually.
The goal is to make **one cohesive website together**.

That means:

* one design system
* one layout style
* one shared structure
* one clean Git workflow

If everyone follows the same structure, the final app will look polished, professional, and much easier to combine at the end.

