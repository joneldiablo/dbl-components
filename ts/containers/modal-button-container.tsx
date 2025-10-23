import React from "react";

import { eventHandler } from "dbl-utils";

import Component, {
  type ComponentProps,
  type ComponentState,
} from "../component";
import {
  bootstrapDependencyError,
  loadBootstrapModal,
} from "../utils/bootstrap";

type BootstrapModalConstructor = Awaited<ReturnType<typeof loadBootstrapModal>>;
type BootstrapModalInstance = BootstrapModalConstructor extends new (...args: any[]) => infer R
  ? R
  : never;

type ModalLifecycleEvent =
  | "show"
  | "shown"
  | "hide"
  | "hidden"
  | "hidePrevented";

export interface ModalButtonContainerProps extends ComponentProps {
  btnClasses?: string | string[];
  label?: React.ReactNode;
  value?: React.ReactNode;
  modalClasses?: string | string[];
  disabled?: boolean;
  open?: boolean;
}

interface ModalButtonContainerState extends ComponentState {
  showModal: boolean;
}

/**
 * Button that toggles a Bootstrap modal rendered inline.
 *
 * @example
 * ```tsx
 * <ModalButtonContainer name="info" label="Open modal">
 *   <div container="header">Title</div>
 *   <div container="body">Body</div>
 * </ModalButtonContainer>
 * ```
 */
export default class ModalButtonContainer extends Component<
  ModalButtonContainerProps,
  ModalButtonContainerState
> {
  declare props: ModalButtonContainerProps;

  static override jsClass = "ModalButtonContainer";

  private readonly events: ModalLifecycleEvent[] = [
    "show",
    "shown",
    "hide",
    "hidden",
    "hidePrevented",
  ];

  private modal?: BootstrapModalInstance;
  private modalElement?: HTMLDivElement | null;
  private ModalCtor?: BootstrapModalConstructor | null;
  private isComponentMounted = false;

  constructor(props: ModalButtonContainerProps) {
    super(props);
    this.state = {
      ...this.state,
      showModal: !!props.open,
    };
  }

  override componentDidMount(): void {
    this.isComponentMounted = true;
    void this.ensureModal();
  }

  override componentWillUnmount(): void {
    this.isComponentMounted = false;
    this.teardownModal();
  }

  private async ensureModal(): Promise<BootstrapModalConstructor | null> {
    if (this.ModalCtor) return this.ModalCtor;
    try {
      const ctor = await loadBootstrapModal();
      if (!this.isComponentMounted) return null;
      this.ModalCtor = ctor;
      this.clearDependencyError();
      return ctor;
    } catch (error) {
      if (this.isComponentMounted) {
        this.setDependencyError(bootstrapDependencyError("modal"));
      }
      return null;
    }
  }

  private toggleModal = (): void => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  private onEvent = (e: Event): void => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split(".")[0] });
  };

  private onClickClose = (): void => {
    this.modal?.hide();
  };

  private onToggleModal = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this.toggleModal();
  };

  private onModalRef = (ref: HTMLDivElement | null): void => {
    if (ref === this.modalElement) return;
    this.teardownModal();
    if (!ref) return;
    void this.attachModal(ref);
  };

  private async attachModal(ref: HTMLDivElement): Promise<void> {
    if (!this.isComponentMounted) return;
    const ModalCtor = await this.ensureModal();
    if (!ModalCtor || !this.isComponentMounted) return;

    this.modalElement = ref;
    this.modal = new ModalCtor(ref, {
      backdrop: false,
    });
    this.events.forEach((eventName) => {
      ref.addEventListener(`${eventName}.bs.modal`, this.onEvent, false);
    });
    ref.addEventListener("hidden.bs.modal", this.onToggleModal, false);
    this.modal.show();
  }

  private teardownModal(): void {
    if (this.modalElement) {
      this.events.forEach((eventName) => {
        this.modalElement?.removeEventListener(`${eventName}.bs.modal`, this.onEvent, false);
      });
      this.modalElement.removeEventListener("hidden.bs.modal", this.onToggleModal, false);
    }
    if (this.modal) {
      this.modal.hide();
      this.modal.dispose();
    }
    this.modal = undefined;
    this.modalElement = null;
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      btnClasses,
      label,
      value,
      modalClasses,
      disabled,
      name,
    } = this.props;
    const { showModal } = this.state;

    const buttonClasses = ["btn", btnClasses]
      .flat()
      .filter(Boolean)
      .join(" ");
    const dialogClasses = ["modal-dialog", modalClasses]
      .flat()
      .filter(Boolean)
      .join(" ");

    const partitions = React.Children.toArray(children).reduce<
      [React.ReactNode[], React.ReactNode[], React.ReactNode[], React.ReactNode[]]
    >((acc, child) => {
      if (typeof child === "string" || typeof child === "number") {
        acc[1].push(child);
        return acc;
      }
      if (!React.isValidElement(child)) return acc;

      const indexParser: Record<string, number> = {
        header: 0,
        body: 1,
        footer: 2,
        content: 3,
      };
      const target = indexParser[child.props?.container as string] ?? 3;
      acc[target].push(child);
      return acc;
    }, [[], [], [], []]);

    const modalContent = partitions.map((content, index) => {
      const classParser = ["modal-header", "modal-body", "modal-footer", ""];
      if (!classParser[index] || !content.length) return content;
      return React.createElement(
        "div",
        { key: index, className: classParser[index] },
        content
      );
    });

    return React.createElement(
      React.Fragment,
      {},
      React.createElement(
        "button",
        {
          className: buttonClasses,
          type: "button",
          disabled,
          onClick: this.onToggleModal,
        },
        label ?? value
      ),
      showModal &&
        React.createElement(
          "div",
          {
            ref: this.onModalRef,
            className: "modal fade",
            id: `${name}-modal`,
            tabIndex: -1,
          },
          React.createElement("div", {
            className: "backdrop",
            onClick: this.onClickClose,
            style: {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              background: "rgb(0 0 0 / 0.5)",
              zIndex: 1040,
            },
          }),
          React.createElement(
            "div",
            { className: dialogClasses, style: { zIndex: 1040 } },
            React.createElement(
              "div",
              { className: "modal-content" },
              modalContent
            )
          )
        )
    );
  }
}
