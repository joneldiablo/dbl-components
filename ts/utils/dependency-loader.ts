import type { ComponentType } from "react";

type DependencyState<T> =
  | {
      status: "pending";
      promise: Promise<T>;
    }
  | {
      status: "fulfilled";
      module: T;
      promise: Promise<T>;
    }
  | {
      status: "rejected";
      error: Error;
      promise: Promise<T>;
    };

const dependencyCache = new Map<string, DependencyState<unknown>>();

/**
 * Normalises unknown errors to Error instances.
 */
function toError(reason: unknown): Error {
  if (reason instanceof Error) return reason;
  return new Error(typeof reason === "string" ? reason : JSON.stringify(reason));
}

/**
 * Ensures a dependency is loaded asynchronously, caching the result for subsequent calls.
 *
 * @param specifier Module specifier to load.
 * @param importer  Optional custom importer used instead of `import(specifier)`.
 */
export function ensureDependency<T = unknown>(
  specifier: string,
  importer?: () => Promise<T>
): Promise<T> {
  const cached = dependencyCache.get(specifier) as DependencyState<T> | undefined;
  if (cached) {
    if (cached.status === "fulfilled") return Promise.resolve(cached.module);
    if (cached.status === "rejected") return Promise.reject(cached.error);
    return cached.promise;
  }

  const loader = importer ?? (() => import(specifier) as Promise<T>);
  const promise = loader()
    .then((module) => {
      dependencyCache.set(specifier, {
        status: "fulfilled",
        module,
        promise,
      });
      return module;
    })
    .catch((reason) => {
      const error = toError(reason);
      dependencyCache.set(specifier, {
        status: "rejected",
        error,
        promise,
      });
      throw error;
    });

  dependencyCache.set(specifier, {
    status: "pending",
    promise,
  });

  return promise;
}

/**
 * Returns the cached dependency module if it has been loaded successfully.
 */
export function getCachedDependency<T = unknown>(specifier: string): T | undefined {
  const cached = dependencyCache.get(specifier);
  if (!cached || cached.status !== "fulfilled") return undefined;
  return cached.module as T;
}

/**
 * Returns the error associated with the dependency if it failed to load previously.
 */
export function getDependencyError(specifier: string): Error | undefined {
  const cached = dependencyCache.get(specifier);
  if (!cached || cached.status !== "rejected") return undefined;
  return cached.error;
}

/**
 * Formats a human readable error message instructing the consumer to install the dependency.
 */
export function formatDependencyError(specifier: string): string {
  return `No se pudo cargar la dependencia "${specifier}". Ejecuta "yarn add ${specifier}" e inténtalo nuevamente.`;
}

/**
 * Logs dependency loading failures to the console in a consistent manner.
 */
export function logDependencyError(specifier: string, error: Error): void {
  if (typeof console !== "undefined" && typeof console.error === "function") {
    console.error(`[dbl-components] Error al cargar "${specifier}":`, error);
  }
}

/**
 * Utility helper to lazily initialise components coming from optional peer dependencies.
 *
 * @example
 * ```ts
 * const LazyIcon = await loadComponent("react-icomoon", (m) => m.default);
 * ```
 */
export async function loadComponent<T extends ComponentType<any>>(
  specifier: string,
  select: (module: any) => T
): Promise<T> {
  const module = await ensureDependency(specifier);
  return select(module);
}
