"use client";
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const BLOGGER_REDIRECTS: Record<string, string> = {
  "2026/05/sunshine-lollipops-and-rainbow-chard.html": "/posts/sunshine-lollipops-and-rainbow-chard",
  "2026/05/time-outs-for-grown-up.html": "/posts/time-outs-for-the-grown-up",
  "2026/05/banana-bread-brunch-with-all-toppings.html": "/posts/banana-bread-brunch-with-all-the-toppings",
  "2026/04/let-there-be-light-sunny-polenta-and.html": "/posts/let-there-be-light-sunny-polenta-and-spring-greens",
  "2026/04/scramblers-original-gangster.html": "/posts/scramblers-the-original-gangster",
  "2026/04/the-tomato-soup-you-dont-wantbut-will.html": "/posts/the-tomato-soup-you-dont-want-but-will-inevitably-make",
  "2026/04/simply-shakshuka.html": "/posts/simply-shakshuka",
  "2026/04/the-kitchen-never-ending-love-story.html": "/posts/the-kitchen-a-never-ending-love-story",
  "2026/04/serenity-and-self-indulgence-in-sip.html": "/posts/serenity-and-self-indulgence-in-a-sip-black-sesame-latte",
  "2026/04/matcha-do-about-nothing.html": "/posts/matcha-do-about-nothing",
  "2026/04/a-little-whimsy-pistachio-cream-bunny.html": "/posts/a-little-whimsy-pistachio-cream-bunny-biscuits",
  "2026/03/the-nibbles-game-some-tips-and-tricks.html": "/posts/the-nibbles-game-some-tips-and-tricks",
  "2026/03/soft-landings-sweet-potato-and-whipped.html": "/posts/soft-landings-sweet-potato-and-whipped-feta",
  "2026/03/have-break-have-yoghurt-pancake.html": "/posts/have-a-break-have-a-yoghurt-pancake",
  "2026/03/10-kitchen-items-i-wished-i-had-bought.html": "/posts/10-kitchen-items-i-wished-i-had-bought-or-been-gifted",
  "2026/03/umami-crunch-anglo-asian-greens.html": "/posts/Umami-Crunch-Anglo-Asian-Greens",
  "2026/02/a-slab-of-summer-almond-lemon-and.html": "/posts/A-Slab-of-Summer-Almond-Lemon-and-Passionfruit-Drizzle-Cake",
  "2026/02/10-kitchen-items-i-wished-id-never.html": "/posts/10-Kitchen-Items-I-Wished-Id-Never-Bought-or-Been-Gifted",
  "2026/02/a-welcome-interlude-toast-three-ways.html": "/posts/a-welcome-interlude-toast-three-ways",
  "2026/02/the-sunk-cost-mousse.html": "/posts/the-sunk-cost-mousse",
  "2026/02/a-better-you-recipe-books-20.html": "/posts/a-better-you-recipe-books-20",
  "2026/02/tender-moments-broccoli-with-lemon.html": "/posts/tender-moments-broccoli-with-lemon-almonds",
  "2026/01/celebrations-commiserations-and.html": "/posts/celebrations-commiserations-and-everything-in-between-the-margarita",
  "2026/01/an-ode-to-cream-ok-so-this-isnt-ode.html": "/posts/an-ode-to-cream",
  "2026/01/inspired-to-nourish-rainbow-noodles.html": "/posts/inspired-to-nourish-rainbow-noodles",
  "2025/07/coming-up-for-air-gentle-roast-of.html": "/posts/coming-up-for-air-a-gentle-roast-of-fennel-and-cream",
  "2025/07/xxx.html": "/posts/halloumi-and-the-concentrated-mind",
  "2025/06/a-soothing-smoothie-bowl-1-cashew-and.html": "/posts/a-soothing-smoothie-bowl-1-cashew-and-berry",
  "2025/06/soak-blend-breathe-or-cashew-milk-for.html": "/posts/soak-blend-breathe-or-cashew-milk-for-when-everythings-a-lot",
  "2025/06/the-classic-broccoli-and-gorgonzola-soup.html": "/posts/a-vegetable-soup-for-a-fruitless-mind",
  "2025/06/courgettes-for-the-countdown.html": "/posts/courgettes-for-the-countdown",
};

interface NotFoundProps {
  title?: string
  description?: string
}

export function Illustration(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362 145" {...props}>
      <path
        fill="currentColor"
        d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM181.67 144.6c-7.333 0-14.333-1.333-21-4-6.666-2.667-12.866-6.733-18.6-12.2-5.733-5.467-10.266-13-13.6-22.6-3.333-9.6-5-20.667-5-33.2 0-12.533 1.667-23.6 5-33.2 3.334-9.6 7.867-17.133 13.6-22.6 5.734-5.467 11.934-9.533 18.6-12.2 6.667-2.8 13.667-4.2 21-4.2 7.467 0 14.534 1.4 21.2 4.2 6.667 2.667 12.8 6.733 18.4 12.2 5.734 5.467 10.267 13 13.6 22.6 3.334 9.6 5 20.667 5 33.2 0 12.533-1.666 23.6-5 33.2-3.333 9.6-7.866 17.133-13.6 22.6-5.6 5.467-11.733 9.533-18.4 12.2-6.666 2.667-13.733 4-21.2 4zm0-31c9.067 0 15.6-3.733 19.6-11.2 4.134-7.6 6.2-17.533 6.2-29.8s-2.066-22.2-6.2-29.8c-4.133-7.6-10.666-11.4-19.6-11.4-8.933 0-15.466 3.8-19.6 11.4-4 7.6-6 17.533-6 29.8s2 22.2 6 29.8c4.134 7.467 10.667 11.2 19.6 11.2zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z"
      />
    </svg>
  )
}

export default function NotFound({
  title = "Page not found",
  description = "Lost, this page is. In another system, it may be.",
}: NotFoundProps) {
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, "");
    const dest = BLOGGER_REDIRECTS[path];
    if (dest) {
      window.location.replace(dest);
    }
  }, []);

  return (
    <div className="relative text-center z-[1] pt-52">
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
        {description}
      </p>
      <div className="mt-10 mx-auto">
        <Button asChild>
          <Link href="/">Take me home</Link>
        </Button>
      </div>
    </div>
  )
}

