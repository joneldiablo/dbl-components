import type Collapse from "bootstrap/js/dist/collapse";
import type Dropdown from "bootstrap/js/dist/dropdown";
import type Modal from "bootstrap/js/dist/modal";
import type Offcanvas from "bootstrap/js/dist/offcanvas";

import {
  ensureDependency,
  formatDependencyError,
  getCachedDependency,
  logDependencyError,
} from "./dependency-loader";

const SPECIFIERS = {
  collapse: "bootstrap/js/dist/collapse",
  dropdown: "bootstrap/js/dist/dropdown",
  modal: "bootstrap/js/dist/modal",
  offcanvas: "bootstrap/js/dist/offcanvas",
};

type BootstrapCtor<T> = T extends { new (...args: any[]): infer R } ? { new (...args: any[]): R } : any;

async function loadBootstrapDependency<T>(
  specifier: keyof typeof SPECIFIERS
): Promise<BootstrapCtor<T>> {
  const moduleSpecifier = SPECIFIERS[specifier];
  const cached = getCachedDependency<any>(moduleSpecifier);
  if (cached) {
    return (cached as any).default ?? cached;
  }
  try {
    const module = await ensureDependency<any>(moduleSpecifier);
    const ctor = (module as any)?.default ?? module;
    return ctor;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logDependencyError(moduleSpecifier, err);
    throw err;
  }
}

export async function loadBootstrapCollapse(): Promise<typeof Collapse> {
  return loadBootstrapDependency<typeof Collapse>("collapse");
}

export async function loadBootstrapDropdown(): Promise<typeof Dropdown> {
  return loadBootstrapDependency<typeof Dropdown>("dropdown");
}

export async function loadBootstrapModal(): Promise<typeof Modal> {
  return loadBootstrapDependency<typeof Modal>("modal");
}

export async function loadBootstrapOffcanvas(): Promise<typeof Offcanvas> {
  return loadBootstrapDependency<typeof Offcanvas>("offcanvas");
}

export function bootstrapDependencyError(specifier: keyof typeof SPECIFIERS): string {
  return formatDependencyError(SPECIFIERS[specifier]);
}
