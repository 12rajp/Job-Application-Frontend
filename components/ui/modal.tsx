"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const Modal = ({ open, onOpenChange, children }: any) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {children}
  </Dialog.Root>
);

export const ModalTrigger = Dialog.Trigger;
export const ModalContent = Dialog.Content;
export const ModalHeader = Dialog.Title;
export const ModalBody = ({ children }: any) => <div className="p-4">{children}</div>;
export const ModalFooter = ({ children }: any) => <div className="p-4 flex justify-end gap-2">{children}</div>;
