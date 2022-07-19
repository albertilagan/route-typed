// prettier-ignore
export type RouteParams<Pattern extends string> =
  Pattern extends `:${infer Param}/${infer Rest}` ? Param | RouteParams<Rest> :
  Pattern extends `:${infer Param}` ? Param :
  Pattern extends `${infer _Prefix}:${infer Rest}` ? RouteParams<`:${Rest}`> :
  never;

// prettier-ignore
export type Params<Pattern extends string> = {[K in RouteParams<Pattern>]: string | number}

// prettier-ignore
export type ParsedRoute<Pattern extends string> =
  Pattern extends '/'  ? Pattern :
  Pattern extends `${infer Prefix}//${infer Suffix}` ? ParsedRoute<`${Prefix}/${Suffix}`> :
  Pattern extends `${infer Prefix}/` ? ParsedRoute<`${Prefix}`> :
  Pattern

// prettier-ignore
export type Route<Pattern extends string> = {
  (params: Params<Pattern>): string;
  route: ParsedRoute<Pattern>;
};

export const route = <Pattern extends string>(pattern: Pattern): Route<Pattern> => {
  const parts = extractParts(pattern);
  const exec = (params: Params<Pattern>) => {
    const parsedRoute = parts
      .map((part) => {
        if (part.type === 'param') {
          return parseValue(params, part.value as RouteParams<Pattern>);
        }
        return part.value;
      })
      .filter((value) => value !== '')
      .join('/');
    return `/${parsedRoute}`;
  };
  exec.route = validateRoute(pattern);
  return exec;
};

export type PartType = 'param' | 'route';
export type Part<Pattern extends string, T extends PartType = PartType> = {
  type: T;
  value: T extends 'param' ? RouteParams<Pattern> : string;
};

export const extractParts = <Pattern extends string>(pattern: Pattern): Part<Pattern>[] => {
  return pattern.split('/').map((part) => {
    if (part.startsWith(':')) return { type: 'param', value: part.replace(/^:/, '') };
    return { type: 'route', value: part };
  });
};

export const validateRoute = <Pattern extends string>(pattern: Pattern): ParsedRoute<Pattern> => {
  if (pattern === '/') {
    return pattern as ParsedRoute<Pattern>;
  }
  return pattern.replace(/\/+/g, '/').replace(/^(.+)\/$/, (_, values) => values) as ParsedRoute<Pattern>;
};

export const parseValue = <Pattern extends string>(
  params: Params<Pattern>,
  paramName: keyof Params<Pattern>
): string => {
  const value = params[paramName];
  return `${value}`;
};

export type RouteConfig<Pattern> = {
  [t in keyof Pattern]: Pattern[t] extends string
    ? Pattern[t]
    : Pattern[t] extends number
    ? never
    : Pattern[t] extends Symbol
    ? never
    : RouteConfig<Pattern[t]>;
};

export type Router<Pattern> = {
  [k in keyof Pattern]: Pattern[k] extends string ? Route<Pattern[k]> : Router<Pattern[k]>;
};

export const createRoutes = <Pattern>(config: RouteConfig<Pattern>): Router<Pattern> => {
  const keys = Object.keys(config);
  return keys.reduce((acc, key) => {
    const value = (config as any)[key];
    return {
      ...acc,
      [key]: typeof value === 'string' ? route(value) : createRoutes(value),
    };
  }, {}) as Router<Pattern>;
};
