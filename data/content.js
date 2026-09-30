/*
 * ============================================================================
 *  DEERGAAM WEBSITE CONTENT
 *  This is the only file you need to edit to update the site.
 * ============================================================================
 *
 *  ADD A NEW VIDEO + PROMPT
 *  1. Copy one of the entries in `projects` below and paste it at the top of the list.
 *  2. Give it a unique `id` (lowercase, words-joined-with-hyphens). It becomes the page URL:
 *       project.html?id=your-id
 *  3. Fill in the fields:
 *       title        Card and page title.
 *       description  One or two sentences.
 *       category     One of the names in `categories` below.
 *       thumbnail    Path to an image in assets/thumbnails/ (16:9 works best).
 *                    Leave "" to use an automatically generated graphic.
 *       videoUrl: "https://www.youtube.com/watch?v=9ULXSRJ-8N0",
 *                    Leave "" to show a clearly labelled placeholder.
 *       featured     true = shown in the "Featured Tutorial" section (the first one is used).
 *       prompt       { title, description, text } — shown in the Prompt Library.
 *                    Use backticks (`) around `text` so it can span many lines.
 *                    Set prompt to null if the project has no prompt.
 *       resources    A list of tools, files, images and links from the video.
 *                    Shown on the video page and in "Tools & Files" on the home page.
 *                    Each one: { type, title, url, description }
 *                      type  "tool"  — an app or website (e.g. https://claude.ai)
 *                            "file"  — a download. Put it in assets/files/ and use
 *                                      url: "assets/files/your-file.zip"
 *                            "image" — a picture. Put it in assets/images/ and use
 *                                      url: "assets/images/your-image.jpg"
 *                            "link"  — any other page (article, source, docs)
 *                    Leave resources: [] if there is nothing to share.
 *       example      true = marks demo entries with an "Example" badge. Delete the
 *                    example entries (or set example: false) once you add real content.
 *  4. Save, reload the page. Done.
 *
 *  SOCIAL LINKS: fill in `url`. Links with an empty url are hidden automatically.
 * ============================================================================
 */
window.DEERGAAM_CONTENT = {
  site: {
    name: "Deergaam",
    tagline: "Exploring artificial intelligence and what it can do.",
  },

  social: [
    { label: "YouTube",   url: "" },            // e.g. "https://www.youtube.com/@your-handle"
    { label: "Instagram", url: "" },
    { label: "TikTok",    url: "" },
    { label: "X",         url: "" },
    { label: "GitHub",    url: "https://github.com/Deergaam" },
  ],

  categories: ["Tutorials", "Motion Graphics", "Images", "Creative Experiments"],

  projects: [
    // ------------------------------------------------------------------ REAL
    {
      id: "motion-graphics-59s",
      title: "Learn to Create AI Motion Graphics in Just 59 Seconds",
      description:
        "Create a Claude project, paste one prompt, customize the topic, length and style, then review, download and publish your own motion graphics video.",
      category: "Tutorials",
      thumbnail: "assets/thumbnails/motion-graphics-59s.jpg",
      videoUrl: "https://www.youtube.com/watch?v=9ULXSRJ-8N0",
      featured: true,
      example: false,
      resources: [
        {
          type: "tool",
          title: "Claude",
          url: "https://claude.ai",
          description: "Where the prompt runs. Create a Project, paste the prompt, then send your topic.",
        },
        {
          type: "image",
          title: "Video thumbnail",
          url: "assets/thumbnails/motion-graphics-59s.jpg",
        },
      ],
      prompt: {
        title: "The Center of Humanity",
        description:
          "A complete brief for a vertical Short that tracks the center of humanity from 1950 to 2100. Nothing to fill in: paste it into Claude as it is.",
        text: `You are a senior motion designer, geographic data visualization specialist, and documentary editor.

Create a complete English motion graphics Short titled:

“THE CENTER OF HUMANITY”

This is a fully self-contained task. Everything needed to understand the creative direction is specified below. Create the visuals, map, animation, typography, and sound yourself. Retrieve any necessary public data independently.

Do not ask me to upload videos, images, logos, audio, datasets, subtitles, or reference files.

GOAL

Tell a fascinating geographic story:

There is a point on Earth with the shortest population-weighted average distance to everyone. As the distribution of humanity changes, that point moves.

Follow its journey from 1950 toward 2100.

Build suspense around one question:
“Where could humanity’s center be in 2100?”

Create the finished video, including the actual animation and export—not just a script or storyboard.

FORMAT

- Vertical YouTube Short.
- Resolution: 1080 × 1920.
- Target duration: 31–35 seconds.
- Smooth animation at 60 fps if supported.
- English narration and on-screen text.
- All essential text comfortably inside mobile-safe margins.

VISUAL STYLE

Create a sophisticated cinematic geography visualization.

Use:
- A deep charcoal background.
- A dimensional globe with accurate coastlines.
- Muted gray land and dark oceans.
- Elegant ivory editorial typography.
- Warm gold highlights.
- One luminous orange-red point.
- Restrained concentric pulses around the point.
- A thin illuminated trail revealing its journey.
- Smooth camera transitions between the globe and regional maps.

The atmosphere should feel mysterious, precise, and visually compelling.

Build the globe and map from real geographic geometry. Keep labels, markers, and paths correctly attached to their coordinates during camera movement.

Use clean country outlines and restrained geographic highlighting.

OPENING

Begin with visible movement on the very first frame.

Show the glowing point moving across the globe while the camera pulls back.

Reveal these short phrases in sequence:

“HUMANITY HAS A CENTER.”

“AND IT’S MOVING.”

Then introduce:

“WHERE WILL IT BE IN 2100?”

Make the point’s destination the unanswered question that carries the viewer through the video.

Keep the final location concealed until the reveal.

STORY AND DATA

Use this proposed journey as a hypothesis to investigate:

- Around 1950: western China.
- Later: toward the Indian subcontinent.
- Around the present: near India and Pakistan.
- Future projections: westward toward Iran and the Gulf.
- Around 2100: potentially toward the Arabian Peninsula.

Verify the journey through a documented calculation. Let the results determine the locations shown.

Use reliable public population sources, including:
https://population.un.org/wpp/

Retrieve suitable public spatial population data independently.

The mathematical objective is:

For each year, find the point on Earth’s surface that minimizes the sum of population-weighted great-circle distances to the represented population locations.

Distinguish this definition from a simple average of latitude and longitude.

Document how the population is represented spatially, including people outside major cities. If future spatial distributions require assumptions, state them clearly.

Separate historical estimates from projections using the source dataset’s actual classification.

For projected portions:
- Display a small readable “PROJECTED” label.
- Change the trail to a dashed line.
- Describe the location as a result of this model and scenario.

Use exact years, distances, movement speeds, and city rankings only when the calculation supports them.

If a defensible geographic calculation cannot be completed, finish a clearly labelled “ILLUSTRATIVE SCENARIO” version. Explain that limitation in the delivery note rather than presenting an invented route as verified research.

SCENE PLAN

0–3 SECONDS — THE MYSTERY

Show the luminous point already moving.

Pull the camera back to reveal its position on the globe.

Animate:
“HUMANITY HAS A CENTER.”
“AND IT’S MOVING.”

Introduce the question about 2100.

3–7 SECONDS — WHAT THE POINT MEANS

Reveal subtle population lights across the globe.

Animate a few representative connections toward the point.

Display:
“The shortest average distance to everyone.”

Keep the explanation simple and visually readable.

7–12 SECONDS — THE JOURNEY BEGINS

Introduce a large “1950.”

Locate the calculated historical starting point.

Advance the year counter as the point moves and leaves its trail.

Arrive at the current modeled position and briefly identify its region.

12–16 SECONDS — WHY IT MOVES

Pull back to show Africa and Asia together.

Use changing population lights to explain how population growth shifts the point.

Display:
“Population growth shifts the center.”

Use numerical population claims only when verified.

16–23 SECONDS — THE FUTURE PATH

Advance through the projected years.

Show the calculated direction of movement.

Introduce the dashed trail and “PROJECTED” label.

Move the camera smoothly toward the approaching destination.

Keep the point easy to follow throughout.

23–29 SECONDS — THE REVEAL

Reveal “2100.”

Illuminate the projected endpoint.

If the verified model supports a location near Riyadh, show:
“NEAR RIYADH”
with:
“Projected by this model.”

Otherwise, show the destination actually supported by the calculation.

Mark any nearby city separately from the modeled point so the two locations remain geographically accurate.

29–35 SECONDS — THE PAYOFF

Pull back to show the completed journey.

Display:
“How close is your city?”

End with a composition that connects naturally to the opening globe shot.

NARRATION

Create a clear, natural English voiceover using available speech-generation tools.

Use this draft, adapting geographic details to the verified model:

“This is humanity’s center—the point with the shortest average distance to everyone on Earth.

And it’s moving.

In 1950, this model places it in western China.

Today, it’s near India and Pakistan.

As Africa’s population grows, the projected center shifts west.

Toward Iran. Then the Gulf.

By 2100, this model places it south of Riyadh.

That’s a projection, not a guaranteed future.

How close is your city?”

Adjust the wording to match the actual results. For an illustrative version, explicitly describe the route as illustrative.

Synchronize the visuals and captions with the narration.

If speech generation is unavailable, complete the video with carefully timed readable captions and sound effects. Clearly identify it as a version without narration. Do not request an audio upload.

PACING AND SOUND

Introduce a meaningful visual development approximately every two to three seconds:
- A new year.
- A geographic crossing.
- A camera movement.
- An explanatory highlight.
- A destination reveal.

Keep reading time comfortable.

Use a concise opening impact, subtle movement sounds, soft milestone pulses, and a controlled accent at the final reveal.

Keep narration clear and prominent.

IMPLEMENTATION

Inspect the available tools and choose a supported animation and rendering workflow.

Create every visual element yourself using code, geographic geometry, typography, procedural effects, or available generation tools.

Drive the camera, point, trail, captions, and year counter from one consistent timeline.

Make the animation reproducible and editable.

DELIVERY

Render and deliver:
- center_of_humanity.mp4
- The editable project.
- The generated or retrieved data used in the calculation.
- A concise methodology and source note.
- English subtitles if narration is included.

Watch the rendered result before delivery.

Check:
- Geographic accuracy.
- Text spelling and readability.
- Marker placement.
- Narration synchronization.
- Smooth camera movement.
- Clear projection labels.
- A strong opening and readable final reveal.

Fix visible problems and render again.

If MP4 rendering is unavailable, deliver the complete playable animation, editable source, and exact export instructions. State clearly which deliverables were produced.

Complete the work autonomously using this brief and publicly accessible resources. Do not stop at a plan or request attachments.`,
      },
    },

    // ------------------------------------------------------------------ EXAMPLES
    // Demo entries that show how the layout works. Replace or delete them.
    {
      id: "example-data-story",
      title: "Example: Animated Data Story",
      description:
        "Example entry. A bar chart that races through the years with smooth rank changes and clear labels.",
      category: "Motion Graphics",
      thumbnail: "",
      videoUrl: "",
      featured: false,
      example: true,
      prompt: {
        title: "Animated Bar-Chart Race",
        description: "Example prompt. Turns a small dataset into a short animated ranking video.",
        text: `Create a 30-second animated bar-chart race from the data I paste below.

Data: [PASTE A TABLE: category, year, value]
Title: [CHART TITLE]
Source: [WHERE THE DATA COMES FROM]

• Smooth rank changes with eased motion, one year per second.
• Large, readable labels and a running year counter.
• One accent color for the leader; muted colors for the rest.
• Show the data source in small text at the bottom.
• If a value is missing, say so on screen instead of guessing.
• Deliver a playable MP4 if possible, otherwise an HTML animation with export steps.`,
      },
    },
    {
      id: "example-image-series",
      title: "Example: Cinematic AI Image Series",
      description:
        "Example entry. A set of images that share one lighting style, palette and character, so they feel like frames from the same film.",
      category: "Images",
      thumbnail: "",
      videoUrl: "",
      featured: false,
      example: true,
      prompt: {
        title: "Consistent Image Series",
        description: "Example prompt. Keeps style, palette and subject consistent across several images.",
        text: `Design a series of [NUMBER] cinematic images about [SUBJECT].

Keep these identical in every image:
• Color palette: [e.g. deep navy, icy cyan, warm highlights]
• Lighting: [e.g. soft rim light, light fog]
• Lens and framing: [e.g. 35 mm, eye level]

For each image, write:
1. A one-line scene description.
2. A detailed image prompt I can paste into an image generator.
3. A short caption for social media.

Make the series tell a small story from the first image to the last.`,
      },
    },
    {
      id: "example-creative-experiment",
      title: "Example: Poem to Visual Story",
      description:
        "Example entry. An experiment that turns a short poem into a storyboard, a color script and a narrated animatic.",
      category: "Creative Experiments",
      thumbnail: "",
      videoUrl: "",
      featured: false,
      example: true,
      prompt: {
        title: "Poem to Storyboard",
        description: "Example prompt. Breaks a text into scenes, visuals and timing for a short video.",
        text: `Turn the text below into a visual story.

Text: [PASTE A SHORT POEM OR PARAGRAPH]

1. Split it into 6 to 8 scenes.
2. For each scene give: the line of text, what we see, camera movement, and mood.
3. Suggest one color palette for the whole piece and explain why it fits.
4. Write narration timing so the whole story lasts about [LENGTH] seconds.
5. Finish with a one-sentence idea for the final frame.`,
      },
    },
    {
      id: "example-prompt-basics",
      title: "Example: Writing Better Prompts",
      description:
        "Example entry. A short tutorial about giving AI a clear goal, format, and constraints, and asking it to check its own work.",
      category: "Tutorials",
      thumbnail: "",
      videoUrl: "",
      featured: false,
      example: true,
      prompt: {
        title: "Prompt Template: Goal, Format, Checks",
        description: "Example prompt. A reusable structure for almost any creative task.",
        text: `Goal: [WHAT YOU WANT TO MAKE, AND FOR WHOM]

Context:
• [IMPORTANT BACKGROUND OR FILES]

Format:
• [LENGTH, SIZE OR FILE TYPE]
• [TONE AND STYLE]

Constraints:
• [WHAT TO AVOID]

Before you finish:
• Check the result against the goal and the format.
• Fix anything that does not match, then deliver the final version.`,
      },
    },
  ],
};
