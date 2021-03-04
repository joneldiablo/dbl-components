import Field from "./field";

export default class NakedField extends Field {
  render() {
    return this.content();
  }
};