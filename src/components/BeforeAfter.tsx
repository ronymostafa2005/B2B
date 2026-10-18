"use client";

import { useState } from "react";

export function BeforeAfter() {
  const [pos, setPos] = useState(58);

  return (
    <section className="section" id="makeover">
      <div className="wrap">
        <header className="section-head">
          <div>
            <p className="eyebrow">
              <span>02</span> Before and after
            </p>
            <h2>A clinic day, from paper to screen.</h2>
          </div>
          <p className="deck">
            Drag the line. The left side is the paper day. The right side is the same day on the system.
          </p>
        </header>

        <div className="compare" style={{ ["--pos" as string]: `${pos}%` }}>
          <div className="pane pane-before" aria-hidden="true">
            <p className="pane-label">Before</p>
            <ul>
              <li>Dr. Mona — 4:30? Confirm</li>
              <li>Ahmed called twice</li>
              <li>Visit 6 cancelled, or not</li>
              <li>Follow-up note is with reception</li>
            </ul>
          </div>
          <div className="pane pane-after" aria-hidden="true">
            <p className="pane-label">After</p>
            <div className="slot">
              <strong>04:30</strong>
              <span>Dr. Mona · Visit</span>
              <em>Confirmed</em>
            </div>
            <div className="slot">
              <strong>05:10</strong>
              <span>Ahmed · Follow-up</span>
              <em>Waiting</em>
            </div>
            <div className="slot">
              <strong>06:00</strong>
              <span>New visit</span>
              <em>Open</em>
            </div>
          </div>
          <input
            type="range"
            min={8}
            max={92}
            value={pos}
            aria-label="Drag to compare bookings before and after the system"
            onChange={(event) => setPos(Number(event.target.value))}
          />
        </div>

        <div className="case-lines">
          <p>
            <span>Problem</span>
            Booking took hours out of the day, and the slot was confirmed late.
          </p>
          <p>
            <span>Solution</span>
            The system puts appointments and follow-up on one screen, so the team stays with the patient.
          </p>
        </div>
      </div>
    </section>
  );
}
