"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export interface TabItem {
  label: string;
  content: ReactNode;
}

export default function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="naccs">
      <div className="tabs">
        <div className="row">
          <div className="col-lg-12">
            <div className="menu">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`gradient-border ${active === i ? "active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-12">
            <ul className="nacc">
              {items.map((item, i) => (
                <li key={i} className={active === i ? "active" : ""}>
                  <div>{item.content}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
