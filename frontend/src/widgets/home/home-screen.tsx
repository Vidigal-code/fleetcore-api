'use client';

import { HomeCta } from '@/widgets/home/ui/home-cta';
import { HomeCapabilities } from '@/widgets/home/ui/home-capabilities';
import { HomeHero } from '@/widgets/home/ui/home-hero';

export const HomeScreen = () => (
  <main className="flex flex-col gap-16 pb-24 pt-16 sm:gap-20 sm:pt-20">
    <HomeHero />
    <HomeCapabilities />
    <HomeCta />
  </main>
);
