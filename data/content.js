/*
 * ============================================================================
 *  DEERGAAM WEBSITE CONTENT
 *  This is the only file you need to edit to update the site.
 * ============================================================================
 *
 *  ADD THE YOUTUBE LINK
 *    Paste it in `youtubeUrl` below (watch, youtu.be or shorts links all work).
 *
 *  ADD A NEW VIDEO
 *    Copy the whole { ... } block in `videos`, paste it at the TOP of the list,
 *    and change the fields. The newest video appears first on the home page.
 *
 *    id           Unique, lowercase-with-hyphens. Page URL: project.html?id=your-id
 *    title        Video title.
 *    description  One or two sentences.
 *    thumbnail    Image in assets/thumbnails/ (16:9).
 *    youtubeUrl   The YouTube link ("" = shows "coming soon").
 *    steps        The explanation under the video: { title, text } per step.
 *    prompt       { title, description, text }. Use backticks (`) around text.
 *                 For more than one prompt use:  prompts: [ {...}, {...} ]
 *    resources    Tools, files, images and links:  { type, title, url, description }
 *                   type "tool"  — an app or website
 *                        "file"  — put it in assets/files/,  url: "assets/files/name.zip"
 *                        "image" — put it in assets/images/, url: "assets/images/name.jpg"
 *                        "link"  — any other page
 *
 *  SOCIAL LINKS: fill in `url`. Empty ones are hidden. The YouTube one also
 *  shows as a "YouTube channel" button in the header.
 * ============================================================================
 */
window.DEERGAAM_CONTENT = {
  social: [
    { label: "YouTube",   url: "" },            // e.g. "https://www.youtube.com/@your-handle"
    { label: "Instagram", url: "" },
    { label: "TikTok",    url: "" },
    { label: "X",         url: "" },
    { label: "GitHub",    url: "https://github.com/Deergaam" },
  ],

  videos: [
    {
      id: "motion-graphics-59s",
      title: "Learn to Create AI Motion Graphics in Just 59 Seconds",
      description:
        "Create a Claude project, paste one prompt, customize the topic, length and style, then review, download and publish your own motion graphics video.",
      thumbnail: "assets/thumbnails/motion-graphics-59s.jpg",
      youtubeUrl: "", // ← paste the YouTube link here

      steps: [
        {
          title: "Create a project in Claude",
          text: "Open claude.ai, go to Projects and create a new project for your videos.",
        },
        {
          title: "Paste the prompt",
          text: "Copy the prompt below and paste it into the chat in your project.",
        },
        {
          title: "Customize it",
          text: "Replace [TOPIC], [LENGTH] and [STYLE] with your own idea, then send it.",
        },
        {
          title: "Review, download and publish",
          text: "Watch the result, ask Claude for any fixes, then download the video and publish it.",
        },
      ],

      prompt: {
        title: "AI Motion Graphics Video",
        description: "Fill in the topic, video length and visual style, then send it to Claude.",
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

      resources: [
        {
          type: "tool",
          title: "Claude",
          url: "https://claude.ai",
          description: "Where the prompt runs. Create a project, paste the prompt, then send your topic.",
        },
      ],
    },
  ],
};
