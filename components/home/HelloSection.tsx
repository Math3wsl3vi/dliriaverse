"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const HelloSection = () => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || "User");
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const now = new Date();
  const time = now.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(now);

  return (
    <div className="px-6 pt-5">
      <h1 className="capitalize font-poppins">Good Morning {name ?? "..."}</h1>
      <p className="font-poppins my-2">{date} {time}</p>
    </div>
  );
};

export default HelloSection;
