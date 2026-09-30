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
 *       videoUrl     A YouTube link (watch, youtu.be or shorts link all work).
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
      videoUrl: "", // ← paste the YouTube URL here when the video is live
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
        title: "AI Motion Graphics Video",
        description:
          "The full prompt from the 59-second tutorial. Fill in the topic, video length and visual style, then send it to Claude.",
        text: `You are the lead video editor and motion designer for my YouTube channel. Create a finished, polished motion graphics video from my idea. Build the animation, captions, transitions and sound design.

Topic: [TOPIC] (e.g. Coffee prices worldwide)
Video length: [LENGTH] (e.g. 59 seconds)
Visual style: [STYLE] (e.g. Cinematic)

FORMAT
• Vertical 1080×1920 for a Short, or horizontal 1920×1080 for a regular video. 30 fps.
• Keep all important text large, readable on a phone, and away from the edges.

STORY
• Hook viewers in the first 2 seconds with the most surprising fact or visual.
• Build the story in clear beats, one idea per scene.
• End with a strong final line and a subtle loop back to the opening.

MOTION DESIGN
• Premium studio look: bold typography, animated charts or maps, depth, masking and smooth camera moves.
• Every movement should guide attention to what matters in that moment.
• Use one consistent color palette and one or two typefaces.
• Use only accurate data and name your sources. If a number is only illustrative, label it clearly.

AUDIO AND CAPTIONS
• If I attach a voice recording, use it as the master track and sync every scene and caption to it.
• If I don't, write a short narration script and time the visuals to it.
• Show captions in short phrases of 2 to 6 words, with key words highlighted.
• Add restrained sound effects: soft whooshes, clicks and one opening impact.

DELIVERY
• Render a playable MP4 if your environment supports it. Otherwise, deliver the complete playable animation with the editable source and exact export steps.
• Include a subtitle file (.srt).
• Before delivering, review the result: timing, spelling, readability and transitions. Fix any problems you find.
• Make sensible creative decisions and finish the video without asking me to choose between options.`,
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
