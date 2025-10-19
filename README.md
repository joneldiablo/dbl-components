# DBL Components

DBL Components is a React component framework built on top of Bootstrap 5. It powers JSON-driven interfaces by converting declarative configuration objects into fully interactive layouts.

## Install

```bash
yarn install
```

## Build

```bash
yarn build
```

## Test

```bash
yarn test
```

## Usage as dependency

```ts
import JsonRender from "dbl-components/ts/json-render";

const renderer = new JsonRender({ name: "demo" }, () => ({}));
const tree = renderer.buildContent({
  name: "root",
  component: "View",
  content: [{
    name: "headline",
    component: "TitleView",
    content: "Hello!",
  }],
});
```

## Minimal CLI example

Even though the project does not ship with a CLI wrapper, the underlying logic can be scripted directly:

```ts
import JsonRender from "dbl-components/ts/json-render";

async function main() {
  const renderer = new JsonRender({ name: "demo" }, () => ({}));
  const layout = renderer.buildContent({
    name: "form",
    component: "Form",
    content: [
      {
        name: "autocomplete",
        component: "AutocompleteField",
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
      },
    ],
  });
  console.log(layout);
}

main();
```

## Examples

### `AutocompleteField`

```tsx
import AutocompleteField from "dbl-components/ts/forms/fields/autocomplete-field";

export default function Example() {
  return (
    <AutocompleteField
      name="user"
      label="Select a user"
      options={[
        { label: "Alice", value: "alice" },
        { label: "Bob", value: "bob" },
      ]}
    />
  );
}
```

## TODO

- [ ] Order container breakpoints and align them with the Sass `$container-max-widths` map.
- [ ] Create a panel component that supports swipe gestures, toggles icon-only mode on mobile, and animates fully hidden and expanded states.
- [ ] Update the navigation component so the toggle accepts the event name used to collapse the text when only icons should remain visible.
- [ ] Create a new table component that receives column definitions as content.
- [ ] Allow the table component to manage visible columns through an array of names.
- [ ] Allow passing React components through the `component` field in JSON views.
- [ ] Make `ReactRouterSchema` behave like `View`, or merge both so either can be used interchangeably.
- [ ] Allow specifying multiple mount points for child routes, either by passing an array of component names or by mapping specific route names to container components.
- [ ] Extract the recursive algorithm in `View` into standalone functions so that other modules, such as reference resolvers, can reuse it.
- [ ] Extract helper functions into a separate library for backend projects.
- [ ] Add dropdown and collapsible submenu support to the navigation components.
