# Bipul Kumar — Developer Portfolio (`vipuldhurvey.github.io`)

A futuristic, responsive, dark-themed personal developer portfolio built exclusively with **HTML5**, **CSS3**, and **Vanilla JavaScript** — engineered for zero-cost static hosting on **GitHub Pages**.

Live target URL: **https://vipuldhurvey.github.io/**

---

## Features

- **Pure Static Web Stack**: Built with semantic HTML5, modern CSS3 (Grid, Flexbox, Glassmorphism, Keyframes, Custom Properties), and modular Vanilla JavaScript (`main.js`, `github.js`, `animations.js`). No React, Vue, Angular, build tools, or backend servers required.
- **Dark / Light Theme Switcher**: Persists theme preference in `localStorage` with zero pre-paint flash.
- **Full-Screen Animated Hero**: Interactive HTML5 `<canvas>` particle constellation, gradient typography, floating technology icons, 3D tiltable developer showcase, and dual CTAs.
- **Authentic Profile & Career Story**: Highlights Bipul Kumar's transition from six years of industrial machine operations at Kewal Kiran Clothing Ltd., Diploma in Electrical Engineering (2016), Tally ERP 9 (2016), and B.A. in Psychology (2021) into Full Stack Web Development training at Coding Ninjas.
- **Technical Skills & Capabilities**: Displays core technologies (`HTML5`, `CSS3`, `JavaScript`, `Java`, `WordPress`, `Shopify`, `Responsive Web Design`, `Frontend Development`, `Bug Fixing`, `Database Fundamentals`) with authentic SVG logos and zero invented percentages.
- **Dynamic GitHub REST API Integration**:
  - Live-fetches profile info, all public repositories (`https://api.github.com/users/Vipuldhurvey/repos?per_page=100&sort=updated`), and recent public events (`https://api.github.com/users/Vipuldhurvey/events/public?per_page=30`) without requiring a personal access token.
  - Dynamically categorizes repositories across **Featured Projects**, **Web Applications**, **JavaScript Projects**, **Java Projects**, **Backend / API Projects**, **DSA & Programming**, **Database Projects**, and **Learning & Experiments**.
  - Truthfully distinguishes showcase demos from coursework, skill tests, and learning exercises.
  - Provides real-time search, category filtering, sorting (`Recently Updated`, `Featured First`, `Most Stars`, `Name A–Z`), Load More pagination, and a **Project Details Modal** with live `README.md` preview.
  - Displays verified **Live Demo** links only when a valid homepage or static GitHub Pages deployment exists.
  - Includes 30-minute `localStorage` caching and graceful fallback messaging if API rate limits or network errors occur.
- **Live GitHub Statistics Dashboard**: Displays verified repository count, followers, following, star/fork totals, dynamic language breakdown, recently updated repositories, and recent public events.
- **Accessibility & Performance**: Respects `prefers-reduced-motion`, includes skip links, semantic landmarks, keyboard-accessible modals, lazy-loaded visuals, custom `404.html`, and `.nojekyll`.

---

## Project Structure

```text
.
├── index.html
├── 404.html
├── README.md
├── .nojekyll
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── main.js
    │   ├── github.js
    │   └── animations.js
    ├── images/
    │   ├── hero-developer.jpg
    │   ├── profile-placeholder.png
    │   ├── experience/
    │   │   └── industrial-machinery.jpg
    │   └── projects/
    │       ├── backend-architecture.jpg
    │       ├── ecommerce-cms.jpg
    │       ├── frontend-showcase.jpg
    │       ├── java-dsa.jpg
    │       └── javascript-interactive.jpg
    └── icons/
        ├── bugfix.svg
        ├── css3.svg
        ├── database.svg
        ├── favicon.svg
        ├── frontend.svg
        ├── html5.svg
        ├── java.svg
        ├── javascript.svg
        ├── responsive.svg
        ├── shopify.svg
        └── wordpress.svg
```

---

## Local Preview

Because browsers restrict certain features on `file://` URLs, preview locally using any static HTTP server:

```bash
# Using Python 3 (use 8080 or another free port if 8000 is already in use)
python -m http.server 8080 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8080` (or `http://localhost:8080`) in your browser.

---

## Deploying to GitHub Pages (`https://vipuldhurvey.github.io/`)

Follow these step-by-step instructions to publish this site for free on GitHub Pages:

### Step 1: Create the Special GitHub Pages Repository
1. Sign in to GitHub at **https://github.com/Vipuldhurvey**.
2. Click the **`+`** icon in the top-right corner and select **New repository**.
3. Set the **Repository name** to **exactly**:
   ```text
   vipuldhurvey.github.io
   ```
   *(For user sites, the repository name must match `<username>.github.io`.)*
4. Keep the repository **Public** (required for free GitHub Pages hosting).
5. Leave initialization checkboxes unchecked (or initialize empty), then click **Create repository**.

### Step 2: Upload the Portfolio Files
You can upload either via Git CLI or directly in the GitHub web interface:

#### Option A: Using Git CLI (Recommended)
Run these commands inside the root folder containing `index.html`:

```bash
git init
git add .
git commit -m "Deploy futuristic developer portfolio for Bipul Kumar"
git branch -M main
git remote add origin https://github.com/Vipuldhurvey/vipuldhurvey.github.io.git
git push -u origin main
```

#### Option B: Using GitHub Web Upload
1. Open your new `vipuldhurvey.github.io` repository on GitHub.
2. Click **Add file** &rarr; **Upload files** (or **uploading an existing file** on an empty repo).
3. Drag and drop **all files and folders** from this project root (`index.html`, `404.html`, `README.md`, `.nojekyll`, and the `assets/` folder) so that `index.html` sits directly at the repository root.
4. Enter a commit message (e.g., `Add portfolio files`) and click **Commit changes**.

### Step 3: Activate & Verify GitHub Pages
1. In your `vipuldhurvey.github.io` repository, go to **Settings** &rarr; **Pages** (in the left sidebar).
2. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select **`main`** and folder **`/ (root)`**, then click **Save**.
3. Wait 1–2 minutes for GitHub Actions (`pages-build-deployment`) to finish building.
4. Visit **https://vipuldhurvey.github.io/** to view your live portfolio.

> Note: The included `.nojekyll` file tells GitHub Pages to serve all static assets directly without Jekyll processing.

---

## Privacy & Truthfulness Notes

- No personal email address, phone number, WhatsApp number, home address, or contact form is published in this repository.
- No fabricated proficiency percentages, client testimonials, or unverified employment claims are included.
- Representative category illustrations are clearly labeled as illustrative visuals rather than software screenshots.

