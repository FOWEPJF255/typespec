# Optional custom server parameter

The options interface declares the same custom parameter consumed by the context factory. The existing endpoint option remains available for compatibility.

## TypeSpec

```tsp
@service
@server(
  "{baseUrl}",
  "",
  {
    baseUrl?: url = "http://localhost:3000",
  }
)
namespace Repro;

@get op read(): void;
```

## Client options

```ts src/api/reproClientContext.ts interface ReproClientOptions
export interface ReproClientOptions extends ClientOptions {
  endpoint?: string;
  baseUrl?: string;
}
```

## Default value

```ts src/api/reproClientContext.ts function createReproClientContext
export function createReproClientContext(options?: ReproClientOptions): ReproClientContext {
  const params: Record<string, any> = {
    baseUrl: options?.baseUrl ?? "http://localhost:3000",
  };
  const resolvedEndpoint = "{baseUrl}".replace(/{([^}]+)}/g, (_, key) =>
    key in params
      ? String(params[key])
      : (() => {
          throw new Error(`Missing parameter: ${key}`);
        })(),
  );
  return getClient(resolvedEndpoint, {
    ...options,
  });
}
```

# Mixed required and optional server parameters

Required parameters remain constructor arguments. Optional string and numeric parameters belong in the options interface, whether or not they have defaults.

## TypeSpec

```tsp
@service
@server(
  "{host}/{apiVersion}/{port}/{region}",
  "",
  {
    host: url,
    apiVersion?: string = "v1",
    port?: int32 = 8080,
    region?: string,
  }
)
namespace Mixed;

@get op read(): void;
```

## Client options

```ts src/api/mixedClientContext.ts interface MixedClientOptions
export interface MixedClientOptions extends ClientOptions {
  endpoint?: string;
  apiVersion?: string;
  port?: number;
  region?: string;
}
```

# Standard endpoint option is declared once

The standard endpoint parameter retains its existing type while other optional server parameters are added.

## TypeSpec

```tsp
@service
@server(
  "{endpoint}/api/{version}",
  "",
  {
    endpoint?: url = "http://localhost:3000",
    version?: string = "v1",
  }
)
namespace Standard;

@get op read(): void;
```

## Client options

```ts src/api/standardClientContext.ts interface StandardClientOptions
export interface StandardClientOptions extends ClientOptions {
  endpoint?: string;
  version?: string;
}
```
