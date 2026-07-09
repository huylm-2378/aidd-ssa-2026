import type { viCore } from "./vi-core";

/**
 * English message fragment matching `vi-core.ts` key-for-key. Typed against
 * `keyof typeof viCore` (not the composed `Messages`) so this file alone
 * catches a missing/extra key here — `en.ts` catches drift between the two
 * fragment pairs as a whole.
 */
export const enCore: Record<keyof typeof viCore, string> = {
  "common.logoHome": "Sun* Annual Awards home",
  "common.logoAlt": "Sun* Annual Awards logo",
  "common.detail": "Details",
  "common.sectionEyebrow": "Sun* Annual Awards 2025",

  "nav.about": "About SAA 2025",
  "nav.awards": "Award Information",
  "nav.kudos": "Sun* Kudos",

  "header.notifications": "Notifications",

  "footer.copyright": "© 2025 Sun*. All rights reserved.",

  "accountMenu.trigger": "Account menu",
  "accountMenu.profile": "Profile",
  "accountMenu.signOut": "Sign out",
  "accountMenu.signIn": "Sign in",

  "hero.comingSoon": "Coming soon",
  "hero.timeLabel": "Time:",
  "hero.venueLabel": "Venue:",
  "hero.broadcastNote": "Live broadcast via Livestream",
  "hero.aboutAwards": "ABOUT AWARDS",
  "hero.aboutKudos": "ABOUT KUDOS",
  "hero.sectionAria": "Event hero",
  "hero.logoAlt": "Root Further",

  "countdown.days": "DAYS",
  "countdown.hours": "HOURS",
  "countdown.minutes": "MINUTES",

  "rootFurther.sectionAria": "Root Further theme story",
  "rootFurther.logoAlt": "Root Further",
  "rootFurther.top1": `Facing the whirlwind pace of change in the AI era and ever-rising client expectations, Sun* has chosen a strategy of diversified capability — not just striving to become elite specialists in our own fields, but aiming higher still, toward a future where every Sunner is a "problem-solver": an expert at tackling every challenge and finding answers to every problem facing our projects, our clients, and society.`,
  "rootFurther.top2": `Inspired by diverse capabilities, flexible growth, and the spirit of digging deeper to break through in the AI era, "Root Further" has been chosen as the official theme of the Sun* Annual Awards 2025.`,
  "rootFurther.top3": `Beyond its surface meaning, "Root Further" is the journey of reaching further and rooting deeper, touching hidden "geological layers" to keep growing, rising, and nurturing the ever-burning passion of Sun* people to create value. Borrowing the image of roots that keep pushing deeper into the earth, winding through layer after layer of "sediment" to absorb the finest nutrients, Sun* people are likewise "absorbing" nourishment from this era and the market's challenges to renew ourselves every day — expanding our capabilities and firmly "taking root" in the AI era: an entirely new "geological layer," complex and unpredictable, yet brimming with potential and opportunity.`,
  "rootFurther.quote": "A tree with deep roots fears no storm",
  "rootFurther.quoteAttr": "(English proverb)",
  "rootFurther.bottom1": `In the face of a storm, only trees with roots strong enough can stand firm. An organization whose people are confident in their diverse capabilities, ready to create and embrace challenges, and to master change, is one that not only stays steady through turbulence but also seizes every advantage and conquers the challenges of the times. More than just the name of a new chapter in our organization's journey, "Root Further" is also a call to action — encouraging each of us to dare to believe in ourselves, dare to dig deeper, unlock every potential, break past our limits, and become the most versatile and excellent version of ourselves. Because in the AI era, diverse capability and harnessing the power of the times are the prerequisites for lasting far into the future.`,
  "rootFurther.bottom2": `No one can know in advance how many mysterious "geological layers" still lie hidden beneath the "ground" of technology and today's market. What we do know is that once "Root Further" becomes our rooted spirit, we won't fear the unknown — we'll feel even more excited by it on our journey forward. Because we always believe that within those very boundless frontiers lie countless wonders and opportunities for us to rise and seize.`,

  "awards.eyebrow": "Sun* annual awards 2025",
  "awards.heading": "Awards System",
  "awards.sectionAria": "Awards",
  "awards.desc.top-talent": "Honoring the top all-round outstanding individuals",
  "awards.desc.top-project":
    "Honoring all-round outstanding projects with standout revenue results",
  "awards.desc.top-project-leader":
    "Honoring inspiring managers who lead projects to breakthrough results,",
  "awards.desc.best-manager":
    "Honoring managers with strong leadership skills who guide their teams",
  "awards.desc.signature-2025-creator":
    "Honoring managers with strong leadership skills who guide their teams",
  "awards.desc.mvp": "Honoring managers with strong leadership skills who guide their teams",

  "banner.sectionAria": "Sun* Kudos promo",
  "banner.eyebrow": "A recognition movement",
  "banner.title": "Sun* Kudos",
  "banner.newPoint": "WHAT'S NEW IN SAA 2025",
  "banner.body": `A recognition and appreciation activity for colleagues — happening for the very first time, open to every Sunner. Launching in November 2025, it encourages Sun* people to share words of recognition and thanks for their colleagues on the platform announced by the organizing committee. These entries will serve as material for the Heads Council to reference when selecting award winners.`,
  "banner.wordmarkAlt": "Sun* Kudos",

  "profile.iconCollection": "My icon collection",
  "profile.openSecretBox": "Open Secret Box",
  "profile.tabSent": "Sent",
  "profile.tabReceived": "Received",
  "profile.emptyKudos": "No Kudos yet",
  "profile.ariaYourKudos": "Your Kudos",

  "stats.received": "Kudos received:",
  "stats.sent": "Kudos sent:",
  "stats.hearts": "Hearts received:",
  "stats.secretOpened": "Secret Boxes opened:",
  "stats.secretUnopened": "Secret Boxes unopened:",

  "filter.clearAll": "All",

  "awardsHero.title": "SAA 2025 Awards System",

  "awardsDetail.quantityLabel": "Number of awards:",
  "awardsDetail.prizeValueLabel": "Prize value:",
  "awardsDetail.or": "Or",
  "awardsDetail.qty.individual": "Individual",
  "awardsDetail.qty.collective": "Team",
  "awardsDetail.qty.individualOrCollective": "Individual or Team",
  "awardsDetail.note.perAward": "per award",
  "awardsDetail.note.individual": "for the individual award",
  "awardsDetail.note.collective": "for the team award",

  "awards.long.top-talent":
    "The Top Talent award honors all-round outstanding individuals — people who consistently demonstrate strong professional expertise and standout performance, delivering value beyond what's expected and earning high praise from both clients and teammates. Ready to take on any task the organization assigns, they are a constant source of inspiration who drive motivation and leave a positive mark on the whole team.",
  "awards.long.top-project":
    "The Top Project award honors outstanding project teams whose business results exceed expectations, whose operations run at peak efficiency, and whose members work with genuine dedication. These are technically demanding projects that make excellent use of resources and budget, propose ideas of real value to clients, deliver outstanding profit, and earn positive client feedback — all while strictly following internal development standards, setting a model of excellence and professionalism.",
  "awards.long.top-project-leader":
    "The Top Project Leader award honors outstanding project managers — people with strong management ability, a powerful gift for inspiring others, and an \"Aim High – Be Agile\" mindset applied to every problem and context. Under their leadership, team members not only overcome challenges together and reach their goals, but also keep their passion burning, carry the Wasshoi spirit, and grow into more accomplished, happier versions of themselves.",
  "awards.long.best-manager":
    "The Best Manager award honors exemplary leaders who have guided their teams to results beyond expectations, making a standout impact on business performance and the organization's sustainable growth. Under their leadership, teams consistently master every goal through versatility, effective collaboration, and a flexible, tech-savvy mindset for the digital era. They inspire their teams to feel confident and energized, ready to embrace — and even lead — transformative change.",
  "awards.long.signature-2025-creator":
    "The Signature award honors an individual or team who embodies the defining spirit Sun* aims for in a given period. For 2025, Signature honors the Creator — an individual or team with a proactive, sharp mindset who sees opportunity in every challenge and takes the lead in acting on it. They are quick to spot problems, quick to identify and deliver practical solutions, and they create clear, tangible value for their project, their clients, or the organization. With a builder's mindset and the distinctly Sun* \"Creator\" spirit, they don't just respond positively to change — they actively drive improvement, helping to set a new standard for how Sun* people create value.",
  "awards.long.mvp":
    "The MVP award honors the single most outstanding individual of the year — a standout figure who represents the entire Sun* community. They have shown exceptional ability, unwavering dedication, and far-reaching influence, leaving a strong mark on Sun*'s journey over the past year. Beyond outstanding performance and results, they are a wellspring of inspiration — through their thinking, their actions, and their positive influence on the team. The MVP embodies every quality of an exemplary Sun* person while carrying a significant responsibility: to stand as a model for Sun*'s people and spirit, helping to lead the community toward new heights.",

  "login.subtitle1": "Begin your journey with SAA 2025.",
  "login.subtitle2": "Sign in to explore!",
  "login.googleButton": "LOGIN With Google",

  "prelaunch.heading": "The event begins in",

  "authError.heading": "Sign-in incomplete",
  "authError.body": "Something went wrong while authenticating with Google. Please try signing in again.",
  "authError.backToLogin": "Back to sign-in",
};
