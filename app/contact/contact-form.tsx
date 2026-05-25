'use client';
import React, { useState } from 'react';

// TODO: Replace with your Web3Forms access key from https://web3forms.com
const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setState('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  const inputClass =
    'w-full rounded border border-[#2c1d14]/20 bg-white px-3 py-2 font-sans text-sm text-[#2c1d14] placeholder:text-[#2c1d14]/30 focus:border-[#a93e33] focus:outline-none focus:ring-1 focus:ring-[#a93e33]/40';

  if (state === 'success') {
    return (
      <div className="rounded-lg bg-[#f7f4ef] border border-[#2c1d14]/10 px-6 py-8 text-center">
        <p className="font-serif text-xl text-[#2c1d14] mb-1">Message sent!</p>
        <p className="font-sans text-sm text-[#2c1d14]/60">Thanks for reaching out — I'll get back to you soon.</p>
        <button
          onClick={() => setState('idle')}
          className="mt-4 font-sans text-xs text-[#a93e33] underline underline-offset-2 hover:text-[#7a2d24]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div>
        <label htmlFor="contact-name" className="block font-sans text-xs font-medium text-[#2c1d14] mb-1">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block font-sans text-xs font-medium text-[#2c1d14] mb-1">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block font-sans text-xs font-medium text-[#2c1d14] mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          className={`${inputClass} resize-y`}
        />
      </div>

      {state === 'error' && (
        <p className="font-sans text-xs text-[#a93e33]">
          Something went wrong — please try again or email me directly at{' '}
          <a href="mailto:carmel@crumbsofsanity.com" className="underline">
            carmel@crumbsofsanity.com
          </a>.
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="self-start inline-flex items-center gap-2 rounded-md bg-[#a93e33] px-5 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-[#7a2d24] disabled:opacity-50"
      >
        {state === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
