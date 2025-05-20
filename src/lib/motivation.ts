
export const motivationalTips = [
  "Small daily improvements lead to stunning results.",
  "Mistakes are proof you're trying. Keep speaking!",
  "Today's effort is tomorrow's fluency.",
  "Don’t be afraid to sound silly – that's how you learn!",
  "Every word you try is a step closer to fluency.",
  "Confidence in your voice, power in your words.",
  "Practice makes progress, not perfection.",
  "Celebrate your small wins!",
  "Learning a language is a journey. Enjoy every step.",
  "Speak boldly, even when you’re unsure."
];

export function getRandomMotivationalTip() {
  return motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
}
