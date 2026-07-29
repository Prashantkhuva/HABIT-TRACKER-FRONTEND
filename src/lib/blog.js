import { SITE_URL } from "./seo-config";

export const ALL_SLUGS = [
  "accountability-for-lasting-habits",
  "design-environment-for-better-habits",
  "evening-habits-better-sleep-recovery",
  "goals-vs-systems-why-goals-hold-you-back",
  "habit-stacking-guide",
  "habit-stacking-link-new-habits",
  "how-to-break-a-bad-habit-for-good",
  "how-to-build-a-habit-loop",
  "how-to-build-daily-rituals",
  "how-to-build-habits-with-no-time",
  "how-to-track-habits-without-burning-out",
  "identity-based-habits-become-the-person-first",
  "keystone-habits-one-habit-changes-everything",
  "morning-habits-science-backed-routine",
  "neuroscience-of-habit-formation",
  "reward-systems-to-accelerate-habit-building",
  "science-of-habit-streaks-consistency",
  "streak-tracking-science",
  "temptation-bundling-make-habits-enjoyable",
  "two-minute-rule-tiny-habits",
  "weekly-review-habit-that-makes-habits-work",
  "why-you-break-habits-how-to-stop",
];

// Related posts map: for each slug, list 2-3 related slugs
const RELATED_POSTS = {
  "how-to-build-daily-rituals": ["habit-stacking-guide", "two-minute-rule-tiny-habits", "streak-tracking-science"],
  "streak-tracking-science": ["science-of-habit-streaks-consistency", "how-to-build-daily-rituals", "neuroscience-of-habit-formation"],
  "habit-stacking-guide": ["how-to-build-daily-rituals", "habit-stacking-link-new-habits", "keystone-habits-one-habit-changes-everything"],
  "morning-habits-science-backed-routine": ["evening-habits-better-sleep-recovery", "how-to-build-daily-rituals", "habit-stacking-guide"],
  "neuroscience-of-habit-formation": ["science-of-habit-streaks-consistency", "how-to-build-a-habit-loop", "how-to-build-daily-rituals"],
  "two-minute-rule-tiny-habits": ["how-to-build-habits-with-no-time", "how-to-build-daily-rituals", "why-you-break-habits-how-to-stop"],
  "how-to-break-a-bad-habit-for-good": ["why-you-break-habits-how-to-stop", "identity-based-habits-become-the-person-first", "design-environment-for-better-habits"],
  "identity-based-habits-become-the-person-first": ["goals-vs-systems-why-goals-hold-you-back", "how-to-build-daily-rituals", "neuroscience-of-habit-formation"],
  "goals-vs-systems-why-goals-hold-you-back": ["how-to-build-daily-rituals", "identity-based-habits-become-the-person-first", "streak-tracking-science"],
  "how-to-build-a-habit-loop": ["neuroscience-of-habit-formation", "habit-stacking-guide", "how-to-build-daily-rituals"],
  "keystone-habits-one-habit-changes-everything": ["habit-stacking-guide", "how-to-build-daily-rituals", "morning-habits-science-backed-routine"],
  "design-environment-for-better-habits": ["how-to-build-daily-rituals", "how-to-break-a-bad-habit-for-good", "temptation-bundling-make-habits-enjoyable"],
  "evening-habits-better-sleep-recovery": ["morning-habits-science-backed-routine", "how-to-build-daily-rituals", "weekly-review-habit-that-makes-habits-work"],
  "temptation-bundling-make-habits-enjoyable": ["reward-systems-to-accelerate-habit-building", "habit-stacking-guide", "how-to-build-daily-rituals"],
  "accountability-for-lasting-habits": ["habit-stacking-guide", "streak-tracking-science", "how-to-build-daily-rituals"],
  "reward-systems-to-accelerate-habit-building": ["temptation-bundling-make-habits-enjoyable", "neuroscience-of-habit-formation", "streak-tracking-science"],
  "how-to-track-habits-without-burning-out": ["streak-tracking-science", "how-to-build-daily-rituals", "weekly-review-habit-that-makes-habits-work"],
  "weekly-review-habit-that-makes-habits-work": ["how-to-build-daily-rituals", "streak-tracking-science", "goals-vs-systems-why-goals-hold-you-back"],
  "science-of-habit-streaks-consistency": ["streak-tracking-science", "neuroscience-of-habit-formation", "how-to-build-daily-rituals"],
  "how-to-build-habits-with-no-time": ["two-minute-rule-tiny-habits", "habit-stacking-guide", "how-to-build-daily-rituals"],
  "habit-stacking-link-new-habits": ["habit-stacking-guide", "how-to-build-daily-rituals", "keystone-habits-one-habit-changes-everything"],
  "why-you-break-habits-how-to-stop": ["how-to-break-a-bad-habit-for-good", "identity-based-habits-become-the-person-first", "streak-tracking-science"],
};

const POST_TITLES = {
  "accountability-for-lasting-habits": "Accountability for Lasting Habits",
  "design-environment-for-better-habits": "Design Your Environment for Better Habits",
  "evening-habits-better-sleep-recovery": "Evening Habits for Better Sleep and Recovery",
  "goals-vs-systems-why-goals-hold-you-back": "Goals vs Systems: Why Goals Hold You Back",
  "habit-stacking-guide": "Habit Stacking: The Ultimate Guide to Building Powerful Routines",
  "habit-stacking-link-new-habits": "Habit Stacking: How to Link New Habits to Existing Routines",
  "how-to-break-a-bad-habit-for-good": "How to Break a Bad Habit for Good",
  "how-to-build-a-habit-loop": "How to Build a Habit Loop That Actually Works",
  "how-to-build-daily-rituals": "How to Build Daily Rituals That Stick: A Practical Guide",
  "how-to-build-habits-with-no-time": "How to Build Habits When You Have No Time",
  "how-to-track-habits-without-burning-out": "How to Track Habits Without Burning Out",
  "identity-based-habits-become-the-person-first": "Identity-Based Habits: Become the Person First",
  "keystone-habits-one-habit-changes-everything": "Keystone Habits: One Habit That Changes Everything",
  "morning-habits-science-backed-routine": "Morning Habits: A Science-Backed Daily Routine",
  "neuroscience-of-habit-formation": "The Neuroscience of Habit Formation",
  "reward-systems-to-accelerate-habit-building": "Reward Systems to Accelerate Habit Building",
  "science-of-habit-streaks-consistency": "The Science of Habit Streaks and Consistency",
  "streak-tracking-science": "The Science of Streak Tracking: Why Consistency Beats Intensity",
  "temptation-bundling-make-habits-enjoyable": "Temptation Bundling: Make Habits Enjoyable",
  "two-minute-rule-tiny-habits": "The Two-Minute Rule: Start with Tiny Habits",
  "weekly-review-habit-that-makes-habits-work": "The Weekly Review: The Habit That Makes Habits Work",
  "why-you-break-habits-how-to-stop": "Why You Break Habits and How to Stop",
};

export function getRelatedPosts(slug, count = 3) {
  const related = RELATED_POSTS[slug] || [];
  return related.slice(0, count).map((s) => ({
    slug: s,
    title: POST_TITLES[s] || s.replace(/-/g, " "),
  }));
}

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

## What Are Implementation Intentions?

An implementation intention is a simple if-then plan: *"If X happens, then I will do Y."* This removes the need to make a decision when the moment arrives.

> "When I finish my morning coffee, I will meditate for 2 minutes."

Start absurdly small. Two minutes of meditation, one push-up, one sentence of journaling. The key is **consistency over intensity**.

## What Is Habit Stacking?

Habit stacking is a technique popularised by James Clear in *Atomic Habits*. Attach a new habit to an existing one. Identify a current routine — brushing your teeth, making coffee, commuting — and stack your new habit immediately after.

For a deeper dive, read our full guide on [habit stacking techniques](/blog/habit-stacking-guide).

## How Does Environmental Design Affect Habits?

Make good habits easy and bad habits hard. If you want to read more, keep a book on your pillow. If you want to eat healthier, wash and cut vegetables as soon as you get home. Your environment shapes your behaviour more than willpower ever will.

## Why Should You Track Everything?

Use a tracker like HabitFlow to log your daily rituals. Seeing your streak grow creates a powerful feedback loop. Research shows that people who track their habits are significantly more likely to maintain them after 6 months. Learn more about the [science behind streak tracking](/blog/streak-tracking-science).
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
## What Is the Dopamine Loop in Habit Formation?

Every time you mark a habit as complete, your brain releases a small amount of dopamine — the same neurotransmitter involved in motivation and reward. This creates a **positive feedback loop** that makes you want to repeat the behaviour.

## What Is the Streak Effect?

Once you have a streak of 3+ days, the psychological cost of breaking it outweighs the effort of doing the habit. This is called the **streak effect**. Your identity shifts from "someone trying to build a habit" to "someone who doesn't miss days."

## Why Does Intensity Fail for Long-Term Habits?

Going all-in on January 1st feels great but is rarely sustainable. Research shows that people who start with small daily actions are **2.5x more likely** to maintain the habit after 6 months compared to those who start with intense sessions.

## How to Track Habits Without Judgment

The goal isn't a perfect streak — it's data. A missed day is information, not failure. Use a habit tracker's heatmap to spot patterns: do you always miss on weekends? After late work nights? Adjust your system, not your willpower.

## Key Metrics That Matter for Streak Tracking

Rather than just tracking yes/no, pay attention to: streak length, completion rate over 30 days, and weekly consistency. These give you a fuller picture of your habit health. For more on how streaks work at a neural level, read about the [neuroscience of habit formation](/blog/neuroscience-of-habit-formation).
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

## Why Does Habit Stacking Work?

Your brain loves patterns. Existing habits are triggered by context cues — time of day, location, preceding action. When you stack a new habit onto an existing cue, you **eliminate the need for motivation or decision-making**.

## Morning Stack Examples

- *After I pour my coffee, I will write one sentence in my journal.*
- *After I brush my teeth, I will do 10 push-ups.*
- *After I sit down at my desk, I will open HabitFlow and check my rituals.*

## Evening Stack Examples

- *After I plug in my phone, I will read one page of a book.*
- *After I change into pyjamas, I will meditate for 2 minutes.*
- *After I get into bed, I will write down three things I'm grateful for.*

## How to Fine-Tune Your Habit Stack

If a stack isn't sticking, adjust the anchor or the size of the new habit. Make it so easy you can't say no. A 2-minute habit done daily beats a 30-minute habit done weekly. Learn how the [two-minute rule](/blog/two-minute-rule-tiny-habits) can help you start smaller.

## Common Mistakes in Habit Stacking

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
