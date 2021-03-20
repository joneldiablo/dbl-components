import Field from "./field";

export default class NoWrapField extends Field {
  render() {
    return this.content();
  }
};