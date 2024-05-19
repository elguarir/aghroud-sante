export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Aghroud Santé",
  description:
    "Un Système de Gestion pour le cabinet de kinésithérapie Aghroud Santé.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blocks",
      href: "/blocks",
    },
    {
      label: "Templates",
      href: "/templates",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Blocks",
      href: "/blocks",
    },
    {
      label: "Templates",
      href: "/templates",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
