import CardGroup from "./card-group";
import GridGroup from "./grid-group";
import Group from "./group";

/**
 * Registry exposing typed group containers for manual composition.
 *
 * @example
 * const { Group } = groups;
 */
const groups = {
  Group,
  GridGroup,
  CardGroup,
};

export type GroupRegistry = typeof groups;

export default groups;
