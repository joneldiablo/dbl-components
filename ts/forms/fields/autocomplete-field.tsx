import React, { createRef } from "react";

import { eventHandler } from "dbl-utils";

import Field, { FieldOption, FieldProps, FieldState } from "./field";

/**
 * Props accepted by {@link AutocompleteField}.
 *
 * @example
 * <AutocompleteField name="city" options={[{ label: "London", value: "lhr" }]} />
 */
export interface AutocompleteFieldProps extends FieldProps {
  /**
   * Maximum number of options displayed at the same time.
   */
  maxItems?: number;
  /**
   * Allow overriding option attributes right before rendering.
   */
  mutations?: (name: string, option: FieldOption) => Partial<FieldOption> | void;
  /**
   * Force the component to fetch options through the event bus even if
   * `options` are already available.
   */
  forceUseFilter?: boolean;
  /**
   * Optional loading node rendered while waiting for async options.
   */
  loading?: React.ReactNode;
}

/**
 * Internal state used by {@link AutocompleteField}.
 */
export interface AutocompleteFieldState extends FieldState {
  /**
   * Whether more options are available for lazy loading.
   */
  more: boolean;
  /**
   * Currently highlighted or selected option.
   */
  selected: FieldOption | null;
  /**
   * CSS visibility flag for the dropdown.
   */
  showDropdown: "" | "show";
  /**
   * Indicates that the component is requesting external data.
   */
  loading: boolean;
}

/**
 * Data dispatched through the `update.<name>` channel.
 */
export interface AutocompleteFieldUpdate {
  options?: FieldOption[];
  more?: boolean;
  value?: any;
  reset?: boolean;
  clear?: boolean;
  [key: string]: any;
}

/**
 * Text input with a dropdown menu of selectable options. It supports both
 * client-side filtering and remote fetching via the shared event bus.
 *
 * @example
 * <AutocompleteField
 *   name="user"
 *   options={[
 *     { label: "Jane", value: 1 },
 *     { label: "John", value: 2 },
 *   ]}
 * />
 */
export default class AutocompleteField<
  P extends AutocompleteFieldProps = AutocompleteFieldProps
> extends Field<P> {
  static jsClass = "AutocompleteField";

  static defaultProps: Partial<AutocompleteFieldProps> = {
    ...Field.defaultProps,
    maxItems: 6,
  };

  menuDropdown = createRef<HTMLUListElement>();
  timeoutFilter?: ReturnType<typeof setTimeout>;

  declare state: AutocompleteFieldState;

  /**
   * Merge helper that preserves base state fields while applying partial updates.
   */
  protected patchState(update: Partial<AutocompleteFieldState>, callback?: () => void): void {
    this.setState(
      (prevState) => ({ ...prevState, ...update }) as AutocompleteFieldState,
      callback
    );
  }

  constructor(props: P) {
    super(props);
    const baseState = this.state as AutocompleteFieldState;
    const maxItems = props.maxItems ?? (AutocompleteField.defaultProps.maxItems as number);
    const providedOptions = props.options ?? [];
    const initialOptions = providedOptions.slice(0, maxItems);
    const selectedOption = providedOptions.find(
      (opt) => opt?.value == (props.value ?? props.default)
    ) || null;
    const initialValue = selectedOption
      ? this.extractString(selectedOption.label as React.ReactNode)
      : baseState.value ?? "";

    this.state = {
      ...baseState,
      options: initialOptions,
      more: providedOptions.length > maxItems,
      showDropdown: "",
      selected: selectedOption,
      loading: false,
      value: initialValue,
    } as AutocompleteFieldState;

    if (!selectedOption && (props.value ?? props.default)) {
      this.state.value = "";
    }
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    clearTimeout(this.timeoutFilter);
  }

  /** @inheritdoc */
  onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target;
    this.patchState(
      {
        value,
        showDropdown: value ? "show" : this.state.showDropdown,
        pristine: false,
        dirty: true,
      },
      () => this.onFilter()
    );
  }

  /**
   * Filter the available options using either the provided list or the
   * asynchronous event channel.
   */
  onFilter(value: string = String(this.state.value ?? "")): void {
    const { options = [], forceUseFilter, maxItems = (AutocompleteField.defaultProps.maxItems as number) } = this.props;
    if (options.length && !forceUseFilter) {
      const normalized = value.toLowerCase();
      const filtered = options.filter((opt) => {
        const label = this.extractString(opt.label as React.ReactNode);
        return label.toLowerCase().includes(normalized);
      });
      this.patchState({
        options: filtered.slice(0, maxItems),
        more: filtered.slice(maxItems).length > 0,
        loading: false,
      });
      return;
    }

    clearTimeout(this.timeoutFilter);
    this.timeoutFilter = setTimeout(() => {
      this.patchState({ loading: true });
      eventHandler.dispatch(`filter.${this.props.name}`, value);
    }, 300);
  }

  /** @inheritdoc */
  onUpdate({ options, more, value, reset, ...update }: AutocompleteFieldUpdate): void {
    const maxItems = this.props.maxItems ?? (AutocompleteField.defaultProps.maxItems as number);
    const nextState: Partial<AutocompleteFieldState> = {};

    if (typeof options !== "undefined") {
      nextState.loading = false;
      nextState.options = options.slice(0, maxItems);
      nextState.more = options.length > maxItems || Boolean(more);
    }

    if (typeof value !== "undefined") {
      nextState.value = "";
      nextState.selected = null;

      if (![null, ""].includes(value)) {
        const mergedOptions = [
          ...(options ?? this.state.options ?? []),
          ...(this.props.options ?? []),
        ];
        const opt = mergedOptions.find((entry) => entry?.value == value) ?? null;
        if (opt) {
          nextState.value = this.extractString(opt.label as React.ReactNode);
          nextState.selected = opt;
        }
      }

      if (this.input.current) {
        const error = this.isInvalid(value);
        if (this.state.error !== error) nextState.error = error;
      }
    }

    if (reset) {
      const defaultValue = this.props.default;
      nextState.value = "";
      nextState.selected = null;

      if (![null, "", undefined].includes(defaultValue)) {
        const mergedOptions = [
          ...(options ?? this.state.options ?? []),
          ...(this.props.options ?? []),
        ];
        const opt = mergedOptions.find((entry) => entry?.value == defaultValue) ?? null;
        if (opt) {
          nextState.value = this.extractString(opt.label as React.ReactNode);
          nextState.selected = opt;
        }
      }

      this._reset = true;
      this.patchState(nextState, () => this.returnData());
      super.onUpdate(update);
      return;
    }

    const hasStateUpdate = Object.keys(nextState).length > 0;
    if (hasStateUpdate) {
      this.patchState(nextState, () => {
        super.onUpdate(update);
      });
    } else {
      super.onUpdate(update);
    }
  }

  /**
   * Display the dropdown and trigger filtering from the current value.
   */
  show = (): void => {
    this.patchState(
      {
        showDropdown: "show",
        value: "",
      },
      () => this.onFilter()
    );
  };

  /**
   * Hide the dropdown restoring the last confirmed selection.
   */
  hide = (): void => {
    const opt = this.state.selected;
    const value = opt ? this.extractString(opt.label as React.ReactNode) : "";
    this.patchState(
      {
        showDropdown: "",
        value,
      },
      () => {
        if (!opt) return;
        const error = this.isInvalid(opt.value);
        if (this.state.error !== error) this.patchState({ error });
      }
    );
  };

  /**
   * Accept an option from the dropdown and notify listeners.
   */
  onSelectOption(opt: FieldOption | null): void {
    this.patchState(
      {
        value: opt && opt.value !== null ? this.extractString(opt.label as React.ReactNode) : "",
        selected: opt,
        error: false,
      },
      () => {
        if (!opt) return;
        this.hide();
        this.returnData(opt.value, { option: opt });
      }
    );
  }

  /**
   * Transform an option into a dropdown list item.
   */
  mapOptions = (optRaw: FieldOption | null): React.ReactNode => {
    if (!optRaw) return false;

    const { mutations, name } = this.props;
    const modify =
      typeof mutations === "function" ? mutations(`${name}.${optRaw.value}`, optRaw) : undefined;
    const opt = Object.assign({}, optRaw, modify || {});
    if (opt.active === false) return false;

    return React.createElement(
      "li",
      { key: opt.value, className: opt.disabled ? "muted" : "" },
      React.createElement(
        "span",
        {
          className: "dropdown-item",
          style: { cursor: "pointer" },
          onClick: !opt.disabled ? () => this.onSelectOption(opt) : undefined,
        },
        opt.label as React.ReactNode
      ),
      opt.divider && React.createElement("hr", { className: "m-0" })
    );
  };

  /** @inheritdoc */
  get type(): string {
    return "text";
  }

  /** @inheritdoc */
  get inputProps(): Record<string, any> {
    const baseProps = { ...super.inputProps };
    const baseOnFocus = baseProps.onFocus;
    baseProps.onFocus = !(baseProps.disabled || baseProps.readOnly)
      ? () => {
          this.show();
          if (typeof baseOnFocus === "function") baseOnFocus();
        }
      : baseProps.onFocus;
    baseProps.autoComplete = "off";
    baseProps.list = "autocompleteOff";
    return baseProps;
  }

  /** @inheritdoc */
  get inputNode(): React.ReactNode {
    const { loading: loadingNode } = this.props;
    const { options = [], more, showDropdown, loading } = this.state;
    const cn = ["dropdown-menu shadow", showDropdown];
    const closeStyle: React.CSSProperties = {
      top: 0,
      left: 0,
      position: "fixed",
      width: "100%",
      height: "100vh",
      opacity: 0,
      zIndex: 1000,
    };
    const inputRect = this.input.current?.getBoundingClientRect() || ({} as DOMRect);
    return React.createElement(
      React.Fragment,
      {},
      showDropdown && React.createElement("div", { onClick: this.hide, style: closeStyle }),
      super.inputNode,
      loading && loadingNode,
      React.createElement(
        "ul",
        {
          className: cn.flat().join(" "),
          ref: this.menuDropdown,
          style: {
            minWidth: inputRect.width || 200,
            left: inputRect.left,
            top: (inputRect.top || 0) + (inputRect.height || 0),
            overflow: "hidden",
            zIndex: 1001,
            position: "fixed",
          },
        },
        options.map(this.mapOptions).filter(Boolean),
        more &&
          React.createElement(
            "li",
            {},
            React.createElement("span", { className: "dropdown-item text-wrap" }, "...")
          )
      )
    );
  }
}
