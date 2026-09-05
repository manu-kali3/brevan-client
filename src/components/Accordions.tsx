"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

export default function Accordions({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="accordions is-first-expanded">
      {items.map((item, i) => (
        <AccordionRow
          key={i}
          title={item.title}
          isOpen={open === i}
          onClick={() => setOpen(i)}
        >
          {item.content}
        </AccordionRow>
      ))}
    </div>
  );
}

function AccordionRow({
  title,
  isOpen,
  onClick,
  children,
}: {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(contentRef.current?.scrollHeight ?? 0);
  }, [isOpen]);

  return (
    <article className="accordion">
      <div
        className={`accordion-head ${isOpen ? "is-open" : ""}`}
        onClick={onClick}
      >
        <span>{title}</span>
        <span className="icon">
          <i className="icon fa fa-chevron-right"></i>
        </span>
      </div>
      <div className="accordion-body" style={{ height: isOpen ? height : 0 }}>
        <div className="content" ref={contentRef}>
          <p>{children}</p>
        </div>
      </div>
    </article>
  );
}
