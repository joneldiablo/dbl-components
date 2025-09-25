import { useState } from "react";

export interface UseClassesOptions {
  fixedClasses?: string | string[];
  initialClasses?: string | string[];
}

const normalize = (classes?: string | string[]): string[] => {
  if (!classes) return [];
  return Array.isArray(classes)
    ? classes.flatMap((c) => c.split(" "))
    : classes.split(" ");
};

/**
 * React hook for managing CSS class sets.
 *
 * @param options - Class configuration.
 * @returns Current classes and mutator helpers.
 *
 * @example
 * ```tsx
 * const { classes, addClasses } = useClasses({ initialClasses: "btn" });
 * addClasses("btn-primary");
 * return <button className={classes.join(" ")}>Click</button>;
 * ```
 */
export default function useClasses({
  fixedClasses,
  initialClasses,
}: UseClassesOptions) {
  const [localClassesSet, setLocalClassesSet] = useState<Set<string>>(
    new Set(normalize(initialClasses))
  );

  const setClasses = (
    classes?: string | string[]
  ): [Set<string>, Set<string>] => {
    const localClasses = new Set(localClassesSet);
    const classSet = new Set(normalize(classes));
    return [localClasses, classSet];
  };

  const toggleClasses = (classes?: string | string[]): boolean => {
    if (!classes) return false;
    const [localClasses, classSet] = setClasses(classes);
    classSet.forEach((c) => {
      if (localClasses.has(c)) localClasses.delete(c);
      else localClasses.add(c);
    });
    setLocalClassesSet(localClasses);
    return true;
  };

  const addClasses = (classes?: string | string[]): boolean => {
    if (!classes) return false;
    const [localClasses, classSet] = setClasses(classes);
    classSet.forEach((c) => localClasses.add(c));
    setLocalClassesSet(localClasses);
    return true;
  };

  const deleteClasses = (classes?: string | string[]): boolean => {
    if (!classes) return false;
    const [localClasses, classSet] = setClasses(classes);
    classSet.forEach((c) => localClasses.delete(c));
    setLocalClassesSet(localClasses);
    return true;
  };

  const classes = [
    ...normalize(fixedClasses),
    ...Array.from(localClassesSet),
  ];

  return { classes, setClasses, toggleClasses, addClasses, deleteClasses };
}

