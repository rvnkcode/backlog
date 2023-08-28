import { writable } from 'svelte/store';

export const selectedContacts = writable(new Set<number>());
