import jsContainers from "../src/js/containers.js";
import Container from "./containers/container";

const CONTAINERS: Record<string, any> = {
  ...jsContainers,
  Container,
};

export const addContainers = (newContainers: Record<string, unknown>): void => {
  Object.assign(CONTAINERS, newContainers);
};

export default CONTAINERS;
