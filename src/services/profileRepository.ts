import { cities, interests, people } from '../mocks/fixtures';
import type { Person, Role } from '../types/models';

export interface ProfileRepository {
  discover(role: Role, blocked: number[]): Promise<Person[]>;
  search(query: string, city: string, interest: string, role: Role, blocked: number[]): Promise<Person[]>;
}

export class LocalProfileRepository implements ProfileRepository {
  async discover(role: Role, blocked: number[]): Promise<Person[]> {
    return people.filter((person) => person.role !== role && !blocked.includes(person.id));
  }

  async search(query: string, city: string, interest: string, role: Role, blocked: number[]): Promise<Person[]> {
    const eligible = await this.discover(role, blocked);
    const normalized = query.trim().toLowerCase();
    return eligible.filter((person) =>
      (!normalized || `${person.name} ${person.city} ${person.work} ${person.interests.join(' ')}`.toLowerCase().includes(normalized)) &&
      (city === 'All' || person.city === city) &&
      (interest === 'All' || person.interests.includes(interest)),
    );
  }
}

export { cities, interests };
