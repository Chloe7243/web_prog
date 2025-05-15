# Race Timer – by up2294223

## Key features

From the home page, you can access key features of the app:

- Create a new race.
- Time any existing race - including races you didn't create.
- Manage races created by you.
- View results of races that has ended or been finalized - This feature is specifically for runners or spectators.

---

### Race Creation

#### How to find and use

From the home screen, click **"Start a new race"**. This opens a modal where you can fill in the race information.

- **Fill in the race name information**: Give your race a name to identify it later in the race history.

#### Design Highlights

- **Use of modal**: This avoids unnecessary page navigation.
- **Validation and error handling**: The modal provides real-time validation. For example, if the race name is left empty an error message appears, preventing the form from being submitted until corrected.
- Automatic navigation to stopwatch page if race is created **successfully**

---

### Timer System

#### How to find and use

From the home screen, click **"Time an existing race"** to open the stopwatch page.

On the stopwatch page you'll see:

- **Start/Stop button** (top left)
- **Reset button** (top right)
- **Mark Time** button (large, center)
- **Live list** of marked times below.

Click **Start** to begin the race. As runners finish laps, click **Mark Time** to save their finish time and position.

#### Design Highlights

- **Color-coded actions**: Start (green), Stop (red), Mark Time (blue)
- **Accidental reset prevention**: A confirmation modal protects against losing race progress.
- **Persistent timing and results**:The times marked remains and the timer continues running even if you navigate away or reload the page unless timer is reset or results are submitted.
- **Race submission**: After stopping the timer, a **"Submit Results"** button appears to finalize the race.
- **Post-race submission**: If navigated to stopwatch page from create race page, race is submitted with provided raceId else a modal shows up, requesting for raceId.
- **Error handling**: If race doesn't exist, race has ended or raceId isn't defined, a descriptive error is diplayed.

---

### Managing Races

#### How to find and use

From the home screen, click **"Manage Races"** to view and manage all races you’ve previously created. This section includes a **search bar** and **filter by date** option to help you quickly locate specific races.

Each race listed shows its information and current status — **ongoing** or **ended** — and provides context-aware actions:

- For **ongoing races**, you can choose to:

  - **Manage Race**: This opens an interface where you can resolve any time conflicts that may have occurred (e.g., inconsistent timestamps) or Save and end race.

- For **ended races**, you can:

  - **View Results**: Access finalized times and positions, with options to export or share.

- For **both**, you can:
  - **Delete**: Permanently remove the race and all associated data.

#### Design Higlights

- **Search and filtering** help reduce friction when managing multiple races.
- **Smart action buttons** ensure users only see relevant controls based on race status.
- **Conflict resolution** is built into the Manage Race flow, allowing organizers to verify times before finalizing results.

---

### View Results as a spectator or runner

#### How to find and use

From the home screen, click **"View race results"**. This opens a modal where you can fill in the race information.

- **Fill in the race ID input field**: Input race id of race you want to view.

The results page includes a **filter by position** and **filter by id** option to help you quickly locate specific runners

#### Design Highlights

- **Use of modal**: This avoids unnecessary page navigation.
- **Validation and error handling**: The modal provides real-time validation. For example, if the race id input field is left empty or race doesn't exist an error message appears, preventing the form from being submitted until corrected.
- Automatic navigation to results if race id is **valid**

---

## Extra Features

### Offline Support

- A **custom service worker** caches files needed for offline function.
- After the first visit, the app can work **completely offline**.
- Caching is done manually in the `service-worker.js`, listing each asset.

### Mobile-First, Responsive Design

- All layouts are **responsive** and work well on both mobile and desktop.
- Uses `rem` units for scalable sizing, with accessibility in mind.

### Toast notifications

- Non-intrusive toast notifications provide **real-time feedback** for user actions like submitting results or errors.

### PDF and CSV Export

- Allows exporting race results as **PDF or CSV**.

--

## Experimental Features

### CSS Anchor Positioning

This app uses **CSS Anchor Positioning** to align elements popovers relative to buttons or other UI components — improving layout accuracy without extra JavaScript.

**Where it was used**:

- Visit `Results page for any race` and click on the `Share Result` button

Since CSS Anchoring is still an experimental feature, it only works in **Chrome 125+** (and some versions of Chromium-based browsers with flags enabled).
Browsers without support will fall back to default positioning — layout may be slightly less precise but still functional.

---

## AI

I used AI to criticise and analyse certain ideas, debugging the project. The process included refining JavaScript logic, handling edge cases with the timer, and improving user interface and usability.
My use of AI wasn't just about solving technical problems; it also helped with explanations, simplifying complex ideas. Below are the areas where I used AI with actual prompts and results.

### Prompts to debug unexpected behaviour with `setInterval` and rendering

**Prompt:**

> My template renders twice due to this function. Do you know why?
> `function S(t, e) {......}`

The response was useless because it didn’t have enough context. I ended up figuring it out myself after using the debugger tool. I realised it was my `setInterval` function that was causing it.

---

### Prompts to improve my SPA Routing and Navigation

I created a routing system where clicking links loads new content into a `<main>` element without reloading the page, and I asked AI for improvements using the following prompts:

**Prompt:**

> brutally criticise this
> … My initial `router.js` file content …

The response was very helpful because it was indeed brutal.

This was the response:

1. **You’re rebuilding a janky SPA framework from scratch.**
   You're manually hacking together routing, component rendering, CSS/JS management, and DOM injection. It’s fragile, inefficient, and prone to subtle bugs. There’s no state management, no modularity, and no proper component lifecycle. If you're going this far, just use a minimal framework like Preact, or at least a basic component architecture.

2. **You're polluting the global state with `currentScript` and `currentStylesheet`.**
   These global references are a bad pattern. What if two components on the same page want to load scripts? You're assuming a single stylesheet/script per route, which won’t scale if components need separate assets.

**Final Verdict:**
🗑️ This is a fragile, overcomplicated, and underspecified SPA engine held together by duct tape. You’re reinventing a worse version of what real frameworks have spent years perfecting — and making all the same mistakes that they’ve already solved. Refactor this into modules with lifecycle control, or just drop in something like Preact or Alpine.js for a lightweight but sane setup.

---

I asked for improvements, and here’s a summary:

**💡 How to Fix It Right:**
Here’s what you should do instead:

- Split responsibilities: routing, rendering, script/style loading.
- Use a dynamic module system instead of injecting `<script>`.
- Use `import.meta.glob` (if using a bundler like Vite) or roll your own lazy loader with ES modules.
- Adopt a mini framework (even a 200-line custom router/component setup) instead of this brittle structure.
- Introduce lifecycle hooks: `onEnter`, `onLeave`, etc.

I made adjustments and repeated the process until I was satisfied with the criticism.

---

### Prompts to fix issues refreshing on SPA

**Prompt:**

> When I refresh a page in my SPA, I get page not found

Because it had context, the response explained that I needed a "catch-all" route handler at the end of my Express server:

app.get("\*", (req, res) => {
res.sendFile(path.join(\_\_dirname, "client", "index.html"));
});

---

### What Went Right

- AI helped refine JavaScript logic, and simplify complex concepts.
- Brutal AI feedback on the SPA routing system led to significant improvements in code structure and maintainability.
- Suggestions for fixing SPA refresh issues (via Express server configuration) worked correctly and solved the problem.

### What Went Wrong

- Some AI responses were unhelpful due to a lack of context, especially with debugging rendering issues caused by `setInterval`.
- Early routing and rendering setup was fragile and overcomplicated, leading to scalability and maintainability issues.
- Repeated attempts were needed to extract useful and specific advice from AI.

### What I Learned

- AI is great for brainstorming, critique, and simplification, but not a replacement for debugging tools or critical thinking.
- Clear, specific prompts result in much better answers.
- Building an SPA requires careful handling of routing, lifecycle, and modularity.

---

## Improvements After First Prototype

- **Optimized Performance with Incremental Updates**
  Initially, updating the race results table caused the entire component to re-render, leading to noticeable lag as the number of runners increased. I refactored the logic so that only the affected runner rows are updated when changes occur, significantly improving performance and responsiveness during live timing.

- **Support for Multiple Timekeepers**
  A key improvement was enabling **multiple users to simultaneously time the race**. Time submissions from different devices or users are all captured and stored, with the system able to detect and manage duplicates or conflicts.

- **Offline Caching for Live Event Reliability**
  Since race events may happen in areas with poor internet access, I implemented offline support using service workers and cache storage. This ensures that previously loaded race data remains accessible even when the network is unreliable.

- **Modular Web Components Architecture**
  I refactored major parts of the interface into **custom Web Components** (e.g., `<race-results>`, `<runner-row>`, `<toast-message>`, etc.). This modular structure made the codebase more maintainable and reusable.

- **Accessibility & Interface Improvements**
  Based on feedback and testing:
  I revised the UI to enhance usability: improved contrast, larger touch targets, and consistent layout behavior across screen sizes.
  Introduced CSS Anchor Positioning, allowing me to replace my custom JavaScript-based positioning logic for my popovers and dropdowns.
