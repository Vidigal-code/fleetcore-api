'use client';

import type { NavigationLink } from '@/entities/navigation/model/navigation';
import { Dropdown, type DropdownItem } from '@/shared/ui/dropdown';

export interface NavSelectProps {
  label: string;
  links: NavigationLink[];
  activeHref?: string;
  onSelectLink: (link: NavigationLink) => void;
  className?: string;
}

const toDropdownItem = (link: NavigationLink, activeHref?: string): DropdownItem => ({
  id: link.id,
  label: link.label,
  active: Boolean(activeHref) && link.href === activeHref,
});

const isCategoryActive = (links: NavigationLink[], activeHref?: string): boolean =>
  Boolean(activeHref) && links.some((link) => link.href === activeHref);

export const NavSelect = ({ label, links, activeHref, onSelectLink, className }: NavSelectProps) => {
  const items = links.map((link) => toDropdownItem(link, activeHref));

  const handleSelect = (item: DropdownItem) => {
    const link = links.find((candidate) => candidate.id === item.id);
    if (link) {
      onSelectLink(link);
    }
  };

  return (
    <Dropdown
      label={label}
      ariaLabel={label}
      items={items}
      onSelect={handleSelect}
      active={isCategoryActive(links, activeHref)}
      className={className}
    />
  );
};
