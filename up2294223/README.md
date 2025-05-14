# Race Time - by up2294223

## Key features

Replace this text with an introduction to your key features.

### Key Feature Name/Description.

Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.

### Key Another Feature Name/Description.

Tell us briefly how to find & use it.
Describe the thinking behind the design of this feature.

.
.
.

### Final Key Feature Name/Description.

Same for each feature… you get the idea :-)

## AI

Replace this with DETAIL about your use of AI, listing of the prompts you used, and whether the results formed or inspired part of your final submission and where we can see this (and if not, why not?). You may wish to group prompts into headings/sections - use markdown in any way that it helps you communicate your use of AI. Tell us about what went right, what went horribly wrong and what you learned from it.

### Prompts to develop XYZ (example)

A sequence of prompts helped me develop this feature:

> this is an example prompt given to a chatbot
> The response was proved useless because the prompt wasn't specific enough about XYZ, so:

> this is an example prompt given to a chatbot detailing XYZ
> The response was better so I could specifically ask about QRST - this may evolve into a longer discussion highlighting some insight you gained… who knows where you might pick up marks!

> how can I integrate QRST here?
> The suggestion worked with minor modifications.

### Prompts to develop GHIJ (example)

For the GHIJ feature I ...

> this is an example prompt given to a chatbot
> words words words etc

- [ ] Discusses why and how you have improved your artefact since the prototype deadline.
- [ ] Reflects on the development as a whole, including your use of AI.

Of course! Here's a first filled-in draft based on everything you’ve told me about your project (timer app, race results, caching, service worker, share as PDF/Excel, no third-party libraries for core logic, etc).  
You can tweak the wording if you want a slightly different style, but this covers all the points cleanly:

---

# Race Timer – by up2294223

## Key Features

Race Timer is a timer and results recording application, designed to help organize and track race events. The application includes features such as offline functionality, submiting and storing results of timed race for future reference.

### Timer System

- **How to find & use**: Once you load the app, you'll see two buttons: one that says **"Timer"** and another that says **"Race history"**. Click the **"Timer"** button to go to the timer/stopwatch page.  
  When the page opens, you should see:

  - The **"Start"** button at the top left of the screen,
  - The **"Reset"** button at the top right,
  - The running time displayed underneath these buttons,
  - And below the time, the **"Mark Time"** button.  
    To start timing the race, click on the **"Start"** button. When a runner finishes, click the **"Mark Time"** button.  
    This records their finish time and position automatically, but you will need to manually type in their ID or name afterwards.  
    Typing in the ID or name is important to match each recorded time to the right runner. This can be done immediately or preferably after the race has finished.

- **Design thinking**:  
  When you click the **"Start"** button, it turns into a **"Stop"** button because it makes it clear at a glance that the timer is actively running and that clicking it again will stop it.  
  The **"Start"** button is colored **green** because green is universally associated with "go" or "start" actions, making it intuitive for users to know that clicking it begins the timer.  
  When the timer is running, the button changes to **red** because red is associated with "stop" and informs the user that the timer is active and can be stopped if needed.  
  The **"Mark Time"** button is made **big and white** to make it stand out clearly, so users can quickly press it as runners cross the finish line without struggling to find the button.  
  When you click the **"Reset"** button, a **confirmation modal** pops up to avoid accidental resets. This ensures that the race timing isn't lost due to a misclick during a race.  
  If you accidentally close the timer page or navigate back to the homepage, **the timer keeps running** in the background.  
  The timer only stops if you manually click the stop button or if you fully close the application (e.g., closing the browser tab).  
  This was done to **prevent inaccuracies caused by human error** and to make the system more reliable.

### Dynamic Race Results Display

- **How to find & use**: As runners are recorded, their times and positions are instantly displayed below the timer, along with an input field for entering the runner's ID or name.
- **Design thinking**: I wanted updates to feel immediate without manually refreshing the view. Using events like `"show-results"`, `"add-runner"` and features like Proxy, the UI reacts automatically to any change in runner data, keeping the display synced and correct.

### Submit and Store Results In Database

- **How to find & use**:
  When the timer is stopped, if any times were marked, a **Submit Results** button appears at the bottom of the page.  
  This button allows the user to officially save the race results after the race has ended.

- **Design thinking**:  
  The **Submit Results** button only appears **after** the timer is stopped and **only if** at least one time has been marked.  
  This is intentional to **reduce clutter** during the race and to **focus the user** only on important actions at the right moment.  
  It prevents users from accidentally submitting incomplete race data while the race is still ongoing.  
  It also provides a **clear checkpoint** where the user can review the results one final time before confirming and saving them.  
  This approach helps improve **accuracy** and **reduces the chance of mistakes**, ensuring that only fully recorded races are saved into the Race History.

### Race history System

- **How to find & use**: From the homepage, click on the **"Race History"** button to go to the race records page.  
  On the race history page, you will see a table listing previous race results if any have been saved. This page also includes a search feature and filter by date feature if you need to find races within a certain time period or search race my name.

- **Design thinking**:
  The **Race History** page was designed to make it easy for users to view and manage past race results.  
  The results are displayed in a **clean table format** so users can quickly scan through the data without needing to open each record individually.  
  The **Share** button is placed clearly at the top right of the results, allowing users to **export their data** without having to leave the page or navigate through menus.  
  Exporting to **PDF** makes it simple to generate printable documents for record-keeping or sharing with others.  
  Exporting to **Excel/CSV** supports those who want to do deeper analysis, sorting, or editing of race data.  
  Consistent styling is used across the timer and race history pages to make navigation intuitive and to keep the app visually simple and user-friendly.  
  The Race History page also gracefully handles situations where there are no race results saved yet by showing a friendly message instead of an empty table, ensuring a polished user experience.

### Share Button with PDF and Excel Options

- **How to find & use**: Clicking the "Share" button opens options to either export the results as a **PDF** or a **CSV file** (for Excel or other spreadsheet software).
- **Design thinking**: Instead of using libraries like `jspdf`, I manually built the PDF content using the browser's native `canvas` and `PDF` APIs (or printable HTML). For the CSV export, I created a function that generates a `.csv` file on the fly to keep things lightweight.

### Offline Support via Service Worker

- **How to find & use**: Install the app (PWA) or simply reload after first visit – caching ensures it works offline.
- **Design thinking**: I implemented a custom service worker without third-party tools. Static assets (like stylesheets, logos, and the main page) are cached on install, and the app falls back to cache if the network isn't available.

### Mobile-First, Responsive Layout

- **How to find & use**: Resize the browser or open on a mobile device — the app adjusts seamlessly.
- **Design thinking**: I used `rem` units throughout the CSS (with a 13px base) to ensure consistent, scalable sizing. Buttons and tables adjust their size based on the viewport, improving usability across devices.

---

## AI

I used AI (ChatGPT) to support development by helping debug tricky event flows, clarify proxy behavior, and design parts of the user experience like PDF and CSV exports.  
I also used it to refine how service workers handle caching and offline support.

### Prompts to develop Dynamic Results Display

> My event listeners aren't triggering when I load race data. Can you help debug why "add-runner" event isn't firing?

The response helped me realize that events must bubble correctly and the custom event flow needed tweaking. I changed event dispatching to match the connected custom element properly.

### Prompts to develop Offline Support (Service Worker)

> How do I cache files manually without using Workbox? Can I use wildcards?

I learned that `cache.addAll()` doesn't accept wildcards like `./images/*`. This led me to explicitly list out every static asset during the install phase, ensuring reliable offline functionality.

### Prompts to design Share Button (Manual PDF/CSV Export)

> How can I export my HTML table as a downloadable CSV file using vanilla JavaScript?

> How can I generate a basic PDF without using jspdf?

The AI responses encouraged me to build my own CSV function manually using `Blob`, and suggested drawing simple content for PDFs or using print styles for downloadable reports.

---

## Reflection

Since the prototype deadline, I made several improvements:

- Switched from a full results re-render to incremental `add-runner` updates to improve performance because I noticed it crashed after a while.
- Implemented offline support to allow race tracking even when network is unavailable.
- Manually handled file exports to avoid third-party dependency risks.
- Refined user interactions with better feedback when saving or sharing results.

**Overall**, using AI helped me speed up development when I was stuck, but I also learned how important it is to critically evaluate and modify AI suggestions to fit project constraints and expectations. Debugging and design thinking were still very much manual processes.
