export type ModalContent = React.ReactNode | (() => React.ReactNode);

type ShowModal = (modal: ModalContent, scrollable?: boolean) => void;
type HideModal = () => void;

export interface ModalContextValue {
  showModal: ShowModal;
  hideModal: HideModal;
}
