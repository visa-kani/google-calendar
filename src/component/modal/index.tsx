import React from "react";
import { Button } from "../button";
import { X } from "lucide-react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl";
    type?: "center" | "corner";
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth, type }: ModalProps) => {
  if (!isOpen) return null;
  
  const maxWidths = {
    sm: "max-w-[300px]",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center z-50 ${type === "center" ? "p-4 justify-center" : ""} `}>
      <div className={`bg-white px-6 py-4 w-full ${maxWidth ? maxWidths[maxWidth] : ""} ${type === "center" ? "max-h-[90vh] rounded-lg" : "rounded-r-lg h-[100vh]"} overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
