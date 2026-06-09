'use client';

import clsx, { ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const formatLicensePlate = (value: string) => value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
