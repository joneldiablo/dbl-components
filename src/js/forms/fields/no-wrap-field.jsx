import Field from "./field";

export default class NoWrapField extends Field {

  static jsClass = 'NoWrapField';
  
  render() {
    return this.content();
  }
};