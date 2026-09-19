/*===== Style Definitions =====*/

/**
 * Keeps named Tailwind groups readable and their keys inferred.
 * Prettier sorts class strings inside this call; it performs no runtime merging.
 */
export function defineStyles<T extends Record<string, unknown>>(styles: T): T {
  return styles;
}

/*===== Variant Composition =====*/

/**
 * Joins each variant's named groups while retaining literal keys for CVA props.
 * Resolve conflicts with cn only after base, variant, and consumer classes are combined.
 */
export function composeStyles<T extends Record<string, Record<string, string>>>(styles: T) {
  return Object.fromEntries(Object.entries(styles).map(([key, groups]) => [key, Object.values(groups).join(" ")])) as {
    [Key in keyof T]: string;
  };
}
