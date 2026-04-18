"use client";

import { useState } from "react";
import Loader from "@/components/animations/loading";

export default function Response() {
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 7000);
  return (
    <div className="response-content">
      {" "}
      {loading ? (
        <Loader />
      ) : (
        <>
          <strong>Pomoc techniczna</strong>
          <p>Znajdziesz tu odpowiedzi na najczęstsze pytania.</p>
        </>
      )}
    </div>
  );
}
