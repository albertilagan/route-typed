import { route } from '../dist';

describe('allow route with no params', () => {
  const p = route('/');
  it('works', () => {
    expect(p()).toBe('/');
    expect(p({})).toBe('/');
    expect(p.route).toBe('/');
  });
});

describe('allow route with params', () => {
  const p = route('/users/:id');
  it('works', () => {
    expect(p({ id: 1 })).toBe('/users/1');
    expect(p.route).toBe('/users/:id');
  });
});
