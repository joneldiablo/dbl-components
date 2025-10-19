import React from "react";
import Modal from "bootstrap/js/dist/modal";

import { eventHandler, splitAndFlat } from "dbl-utils";

import Component, {
  type ComponentProps,
  type ComponentState,
} from "../component";

type ModalLifecycleEvent =
  | "show"
  | "shown"
  | "hide"
  | "hidden"
  | "hidePrevented";

export interface ModalContainerProps extends ComponentProps {
  modal?: Record<string, unknown>;
  modalClasses?: string | string[];
  headerClasses?: string | string[];
  bodyClasses?: string | string[];
  footerClasses?: string | string[];
  closeModalClasses?: string | string[];
  moveElement?: boolean;
  headerTheme?: string | null;
  showClose?: boolean;
  open?: boolean;
  children?: React.ReactNode;
}

interface ModalContainerState extends ComponentState {
  showModal: boolean;
}

/**
 * Wrapper around Bootstrap's modal component with optional portal-like behaviour.
 */
export default class ModalContainer extends Component<
  ModalContainerProps,
  ModalContainerState
> {
  declare props: ModalContainerProps;

  static override jsClass = "ModalContainer";
  static override defaultProps: Partial<ModalContainerProps> = {
    ...Component.defaultProps,
    modal: {},
    modalClasses: "",
    headerClasses: "",
    bodyClasses: "",
    footerClasses: "",
    closeModalClasses: "",
    moveElement: false,
    headerTheme: null,
    showClose: false,
  };

  private readonly bsEvents: ModalLifecycleEvent[] = [
    "show",
    "shown",
    "hide",
    "hidden",
    "hidePrevented",
  ];

  private modal?: Modal;
  private modalElement?: HTMLDivElement | null;
  private originalElement?: HTMLDivElement | null;

  constructor(props: ModalContainerProps) {
    super(props);
    this.state = {
      ...this.state,
      showModal: !!props.open,
    };
  }

  override componentDidMount(): void {
    eventHandler.subscribe(`update.${this.props.name}`, this.onUpdateModal);
  }

  override componentWillUnmount(): void {
    eventHandler.unsubscribe(`update.${this.props.name}`);
    this.disposeModal();
  }

  private onEvent = (e: Event): void => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split(".")[0] });
  };

  private onClickClose = (): void => {
    this.modal?.hide();
  };

  private onUpdateModal = ({ open }: { open?: boolean }): void => {
    if (typeof open === "undefined") return;
    if (!open) {
      this.modal?.hide();
      return;
    }
    this.setState({ showModal: open });
  };

  private disposeModal(): void {
    if (this.modalElement) {
      this.bsEvents.forEach((eventName) =>
        this.modalElement?.removeEventListener(`${eventName}.bs.modal`, this.onEvent, false)
      );
      this.modalElement.removeEventListener("hidden.bs.modal", this.destroy, false);
      if (this.props.moveElement && this.modalElement.parentElement === document.body) {
        document.body.removeChild(this.modalElement);
        if (this.originalElement) this.originalElement.style.display = "";
      }
    }
    if (this.modal) {
      this.modal.dispose();
      this.modal = undefined;
    }
    this.modalElement = null;
    this.originalElement = null;
  }

  private destroy = (): void => {
    this.disposeModal();
    if (this.state.showModal) {
      this.setState({ showModal: false });
    }
  };

  private onModalRef = (refOriginal: HTMLDivElement | null): void => {
    if (!refOriginal) return;
    let ref: HTMLDivElement = refOriginal;
    if (this.props.moveElement) {
      const clone = refOriginal.cloneNode(true) as HTMLDivElement;
      refOriginal.style.display = "none";
      document.body.appendChild(clone);
      ref = clone;
      this.originalElement = refOriginal;
    }

    this.modalElement = ref;
    this.modal = new Modal(ref, this.props.modal);
    this.bsEvents.forEach((eventName) => {
      ref.addEventListener(`${eventName}.bs.modal`, this.onEvent, false);
    });
    ref.addEventListener("hidden.bs.modal", this.destroy, false);
    this.modal.show();
  };

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      modalClasses,
      name,
      showClose,
      headerClasses,
      bodyClasses,
      footerClasses,
      closeModalClasses,
      headerTheme,
    } = this.props;
    const { showModal } = this.state;
    const cnModal = ["modal-dialog", modalClasses]
      .flat()
      .filter(Boolean)
      .join(" ");

    const partitions = React.Children.toArray(children).reduce<{
      header: React.ReactNode[];
      body: React.ReactNode[];
      footer: React.ReactNode[];
      content: React.ReactNode[];
    }>(
      (reducer, child) => {
        if (!child) return reducer;
        if (["string", "number", "boolean"].includes(typeof child)) {
          reducer.body.push(child);
          return reducer;
        }
        if (!React.isValidElement(child)) return reducer;
        const childProps =
          child.props?.container ? child.props : (child.props.children as any)?.props;
        const container = (childProps && reducer[childProps.container]) || reducer.content;
        container.push(child);
        return reducer;
      },
      { header: [], body: [], footer: [], content: [] }
    );

    if (!showModal) return null;

    return React.createElement(
      "div",
      {
        ref: this.onModalRef,
        className: "modal fade",
        id: `${name}-modal`,
        tabIndex: -1,
      },
      React.createElement(
        "div",
        { className: cnModal },
        React.createElement(
          "div",
          { className: "modal-content" },
          showClose &&
            !partitions.header.length &&
            React.createElement(
              "button",
              {
                type: "button",
                className: splitAndFlat(
                  [
                    "btn-close position-absolute end-0 m-3",
                    closeModalClasses,
                  ],
                  " "
                ).join(" "),
                "aria-label": "Close",
                "data-bs-dismiss": "modal",
                style: { zIndex: 1 },
                onClick: this.onClickClose,
              }
            ),
          partitions.content,
          partitions.header.length
            ? React.createElement(
                "div",
                {
                  className: splitAndFlat(
                    ["modal-header ", headerClasses],
                    " "
                  ).join(" "),
                  "data-bs-theme": headerTheme ?? undefined,
                },
                showClose &&
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: splitAndFlat(
                        [
                          "btn-close position-absolute end-0 m-3",
                          closeModalClasses,
                        ],
                        " "
                      ).join(" "),
                      "aria-label": "Close",
                      "data-bs-dismiss": "modal",
                      style: { zIndex: 1 },
                      onClick: this.onClickClose,
                    }
                  ),
                partitions.header
              )
            : null,
          partitions.body.length
            ? React.createElement(
                "div",
                {
                  className: splitAndFlat(
                    ["modal-body ", bodyClasses],
                    " "
                  ).join(" "),
                },
                partitions.body
              )
            : null,
          partitions.footer.length
            ? React.createElement(
                "div",
                {
                  className: splitAndFlat(
                    ["modal-footer ", footerClasses],
                    " "
                  ).join(" "),
                },
                partitions.footer
              )
            : null
        )
      )
    );
  }
}
