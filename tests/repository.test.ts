import { describe, expect, it } from 'vitest';
import { LocalProfileRepository } from '../src/services/profileRepository';

describe('LocalProfileRepository', () => {
  const repository = new LocalProfileRepository();

  it('returns the opposite demo role and omits blocked profiles', async () => {
    const profiles = await repository.discover('boy', [1]);
    expect(profiles.every((person) => person.role === 'girl')).toBe(true);
    expect(profiles.some((person) => person.id === 1)).toBe(false);
  });

  it('combines name, city, and interest filters', async () => {
    const profiles = await repository.search('ananya', 'Bengaluru', 'Coffee', 'boy', []);
    expect(profiles.map((person) => person.name)).toEqual(['Ananya']);
    expect(await repository.search('nobody', 'All', 'All', 'boy', [])).toEqual([]);
  });
});
