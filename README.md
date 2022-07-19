# route-typed

Prevent route errors by making the route params type safe.

## Install

```sh
# npm
npm install route-typed

# yarn
yarn add route-typed
```


## Usage
```jsx
// routes.ts
import { route } from 'route-typed';

export const routes = {
  dashboard: route('/dashboard'),
  user: {
    list: route('/users'),
    view: route('/users/:id'),
  },
};

// or

import { createRoute } from 'route-typed';

export const routes = createRoute({
  dashboard: '/dashboard',
  user: {
    list: '/users',
    view: '/users/:userId',
  },
});

routes.dashboard.route // => /dashboard
routes.dashboard({}) // => /dashboard

routes.user.list.route // => /users
routes.user.list({}) // => /users

routes.user.view.route // => /users/:userId
routes.user.view({ userId: 1 }) // => /users/1

```

```jsx
// app.tsx
import { routes } from '~/routes';

const App = () => {
  return (
    <Routes>
      <Route path={routes.dashboard.route} element={<Dashboard />} />
      <Route path={routes.user.list.route} element={<Users />} />
      <Route path={routes.user.view.route} element={<UserView />} />
    </Routes>
  );
};
```

```jsx
// nav.tsx
import { routes } from '~/routes';

const NavComponent = () => {
  return (
    <>
      <a href={routes.dashboard({})}>Dashboard</a>
      <a href={routes.user.list({})}>Users</a>
    </>
  );
};
```

```jsx
// user/list.tsx
import { routes } from '~/routes';

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
];


const Users = () => {
  return (
    <>
      {users.map(user => (
        <a href={routes.user.view({ id: user.id })}>{user.name}</a>
      ))}
    </>
  );
};
```