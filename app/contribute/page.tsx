import React from "react";

export default function ContributePage() {
  return (
    <main className="mx-auto max-w-[922px] px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-[0.15em] mb-8 text-left">How to Contribute</h1>
      <div className="prose prose-lg font-sans text-neutral-800 leading-relaxed">
        <h2 className="text-xl font-semibold mb-4">🥄 How to Contribute</h2>
        <p>The intention behind Crumbs of Sanity is twofold:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>First, to share the recipes, food rituals, and quiet routines that offered moments of solace, self-care, and grounding throughout my PhD—and the years that followed. These are meals that soothe in moments of struggle, offer calm when comfort is needed, and bring joy when we allow ourselves to celebrate.</li>
          <li>Second, this blog is also a space to share and read stories—personal, imperfect, and sincere—as a way to support others through the tangled experiences before, during, and beyond academic life. It’s for those who turn to cooking as a form of distraction, or as a quiet daily ritual of calm. Or maybe scrolling through food ideas is simply your preferred flavour of procrastination. This blog offers just that: a way to fill those small, stolen moments with something nourishing—something that feeds more than just hunger.</li>
        </ul>
        <p>If you’d like to share your own crumbs—recipes, stories, or reflections—I’d love to hear from you.</p>
        <h2 className="text-xl font-semibold mt-10 mb-4">💌 Who Can Contribute?</h2>
        <p>Anyone with a kind voice and something honest to share. You might be:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>In the thick of academic life</li>
          <li>Trying to enter it</li>
          <li>Figuring out how to leave</li>
          <li>Or building a life after it</li>
        </ul>
        <p>There’s no right story or storyteller. As long as your contribution is thoughtful and respectful, it’s welcome here.</p>
        <h2 className="text-xl font-semibold mt-10 mb-4">📬 How to Submit</h2>
        <p>Please use the contact form in the sidebar to express your interest.</p>
        <p>Once you’ve reached out, I’ll send you a simple template to guide your contribution. Each submission should include:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>A short introduction (how the meal or ritual supported you)</li>
          <li>A recipe written using the provided format</li>
          <li>An optional photo, if you’d like</li>
        </ul>
      </div>
    </main>
  );
}
