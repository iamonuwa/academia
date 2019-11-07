import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalWrapper,
  ModalHeading,
  ModalHeader,
  ModalBody,
  CloseButton
} from "../../theme";

export default function ModalComponent({ open, size, onClose, children }) {
  const [modal, setModal] = useState({
    fadeType: null
  });

  useEffect(() => {
    window.addEventListener("keydown", onEscKeyDown, false);
    return () => window.removeEventListener("keydown", onEscKeyDown, false);
  }, []);

  const transitionEnd = e => {
    if (e.propertyName !== "opacity" || modal.fadeType === "in") return;
    if (modal.fadeType === "out") {
      onClose();
    }
  };

  const onEscKeyDown = e => {
    if (e.key !== "Escape") return;
    onClose();
    setModal({ fadeType: "out" });
  };
  return (
    <ModalWrapper className={open && "active"}>
      <Modal
        role="dialog"
        modalSize={size}
        onTransitionEnd={transitionEnd}
        fadeType={modal.fadeType}
      >
        <ModalHeader>
          <ModalHeading>{children[0]}</ModalHeading>
          <CloseButton onClick={onClose}>+</CloseButton>
        </ModalHeader>
        <ModalBody>{children[1]}</ModalBody>
      </Modal>
    </ModalWrapper>
  );
}
