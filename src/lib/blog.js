import { SITE_URL } from "./seo-config";

export const BLOG_POSTS = [
  {
    slug: "how-to-build-daily-rituals",
    title: "How to Build Daily Rituals That Stick: A Practical Guide",
    description:
      "Learn how to build daily rituals and habits that stick using proven techniques like habit stacking, implementation intentions, and environmental design.",
    published: "2026-05-28",
    lastmod: "2026-05-28",
    image: "/og-image.png",
    readingTime: "5 min read",
    categories: ["Habit Building", "Productivity"],
    content: `
## Why Most Habits Fail

Most people fail at building habits not because they lack motivation, but because they lack a system. Research from Stanford professor BJ Fogg shows that behaviour change succeeds when **motivation, ability, and a prompt** align at the same moment.

## Implementation Intentions

An implementation intention is a simple if-then plan: *"If X happens, then I will do Y."* This removes the need to make a decision when the moment arrives.

> "When I finish my morning coffee, I will meditate for 2 minutes."

Start absurdly small. Two minutes of meditation, one push-up, one sentence of journaling. The key is **consistency over intensity**.

## Habit Stacking

Attach a new habit to an existing one. Identify a current routine — brushing your teeth, making coffee, commuting — and stack your new habit immediately after.

## Environmental Design

Make good habits easy and bad habits hard. If you want to read more, keep a book on your pillow. If you want to eat healthier, wash and cut vegetables as soon as you get home.

## Track Everything

Use a tracker like HabitFlow to log your daily rituals. Seeing your streak grow creates a powerful feedback loop. Never break the chain.
`,
    steps: [
      "Start with a 2-minute version of your habit",
      "Attach it to an existing daily routine",
      "Design your environment for success",
      "Track every completion without judgment",
      "Increase difficulty only after 2 weeks of consistency",
    ],
  },
  {
    slug: "streak-tracking-science",
    title: "The Science of Streak Tracking: Why Consistency Beats Intensity",
    description:
      "Discover the psychology behind streak tracking and how daily consistency rewires your brain for long-term habit formation.",
    published: "2026-05-25",
    lastmod: "2026-05-25",
    image: "/og-image.png",
    readingTime: "4 min read",
    categories: ["Psychology", "Habit Science"],
    content: `
## The Dopamine Loop

Every time you mark a habit as complete, your brain releases a small amount of dopamine — the same neurotransmitter involved in motivation and reward. This creates a **positive feedback loop** that makes you want to repeat the behaviour.

## The Streak Effect

Once you have a streak of 3+ days, the psychological cost of breaking it outweighs the effort of doing the habit. This is called the **streak effect**. Your identity shifts from "someone trying to build a habit" to "someone who doesn't miss days."

## Why Intensity Fails

Going all-in on January 1st feels great but is rarely sustainable. Research shows that people who start with small daily actions are **2.5x more likely** to maintain the habit after 6 months compared to those who start with intense sessions.

## Tracking Without Judgement

The goal isn't a perfect streak — it's data. A missed day is information, not failure. Use HabitFlow's heatmap to spot patterns: do you always miss on weekends? After late work nights? Adjust your system, not your willpower.

## Key Metrics That Matter

Rather than just tracking yes/no, pay attention to: streak length, completion rate over 30 days, and weekly consistency. These give you a fuller picture of your habit health.
`,
    steps: [
      "Track at least one habit daily for 7 days to establish baseline",
      "Review your heatmap weekly to identify weak spots",
      "Never miss twice in a row — that's the only rule",
      "Celebrate small milestones: 7, 14, 21, 30 days",
      "Use streaks as data, not identity",
    ],
  },
  {
    slug: "habit-stacking-guide",
    title: "Habit Stacking: The Ultimate Guide to Building Powerful Routines",
    description:
      "Master habit stacking to build powerful daily routines by anchoring new habits to existing ones. Includes templates and real-world examples.",
    published: "2026-05-20",
    lastmod: "2026-05-20",
    image: "/og-image.png",
    readingTime: "6 min read",
    categories: ["Productivity", "Routine Building"],
    content: `
## What Is Habit Stacking?

Habit stacking is a technique popularised by James Clear in *Atomic Habits*. The formula is simple:

> "After [CURRENT HABIT], I will [NEW HABIT]."

By linking a new behaviour to an existing one, you piggyback on neural pathways that are already automatic.

## Why It Works

Your brain loves patterns. Existing habits are triggered by context cues — time of day, location, preceding action. When you stack a new habit onto an existing cue, you **eliminate the need for motivation or decision-making**.

## Morning Stack Examples

- *After I pour my coffee, I will write one sentence in my journal.*
- *After I brush my teeth, I will do 10 push-ups.*
- *After I sit down at my desk, I will open HabitFlow and check my rituals.*

## Evening Stack Examples

- *After I plug in my phone, I will read one page of a book.*
- *After I change into pyjamas, I will meditate for 2 minutes.*
- *After I get into bed, I will write down three things I'm grateful for.*

## Fine-Tuning Your Stack

If a stack isn't sticking, adjust the anchor or the size of the new habit. Make it so easy you can't say no. A 2-minute habit done daily beats a 30-minute habit done weekly.

## Common Mistakes

- Stacking too many habits at once — start with one stack
- Choosing an inconsistent anchor — your anchor must happen daily
- Making the new habit too hard — reduce friction until it's trivial

Use HabitFlow to design, track, and refine your stacks. The data will show you what works.
`,
    steps: [
      "Identify 3 daily anchors: after waking, after coffee, after dinner",
      "Attach one micro-habit (under 2 minutes) to each anchor",
      "Track all three for 14 days without changing anything",
      "Review your completion data and adjust habit size or anchor",
      "Add a fourth stack only after the first three are automatic",
    ],
  },
];

export function getBlogPost(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

export function getBlogMetadata(slug) {
  const post = getBlogPost(slug);
  if (!post) return null;
  return {
    title: `${post.title} — HabitFlow Blog`,
    description: post.description,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title: `${post.title} — HabitFlow Blog`,
      description: post.description,
      images: [{ url: post.image }],
      publishedTime: post.published,
      modifiedTime: post.lastmod,
      authors: ["Prashant Khuva"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — HabitFlow Blog`,
      description: post.description,
      images: [post.image],
    },
  };
}
