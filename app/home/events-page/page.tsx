"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { firestore } from "@/configs/firebaseConfig";
import { Timestamp } from "firebase/firestore";

interface Event {
  id: string;
  caption: string;
  imageUrl: string;
  location: string;
  name: string;
  profilePic: string;
  createdAt: Timestamp | null;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(firestore, "events"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const fetchedEvents = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              caption: data.caption || "Untitled Event",
              imageUrl: data.images?.[0] || "/images/placeholder.jpg",
              location: data.location || "Unknown",
              name: data.name || "Unknown Organizer",
              profilePic: data.profilePic || "/images/newpic.jpeg",
              createdAt: data.createdAt || null,
            };
          });
          setEvents(fetchedEvents);
          setLoading(false);
        } catch (err) {
          console.error("Error parsing events:", err);
          setError("Something went wrong while loading events.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore listener error:", err);
        setError("Could not fetch events.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="mt-[80px] pt-3 max-w-7xl mx-auto text-center">
        <p className="font-poppins text-lg">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[80px] pt-3 max-w-7xl mx-auto text-center">
        <p className="font-poppins text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-[80px] pt-3 max-w-7xl mx-auto font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="hover:border-t hover:shadow-sm hover:rounded-md py-4 bg-white"
          >
            <Link
              href={`/organizer/${event.name}`}
              className="pl-3 flex items-center gap-3 mb-2"
            >
              <Image
                src={event.profilePic}
                alt={event.name}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <h1 className="font-poppins capitalize">{event.name}</h1>
            </Link>

            <div className="w-full relative p-2">
              <Image
                src={event.imageUrl}
                alt={event.caption}
                width={900}
                height={900}
                className="object-cover w-full h-auto md:w-[400px] md:h-[300px]"
                quality={100}
              />
            </div>

            <div className="flex justify-between mt-2 px-3">
              <h1 className="font-poppins capitalize">
                {event.caption}
              </h1>
              <p className="font-poppins">{event.location}</p>
            </div>

            <div className="px-3 text-sm text-gray-500 font-poppins mt-1">
              <p>
                {event.createdAt
                  ? new Date(event.createdAt.toDate()).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "No Date"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[105px]"></div>
    </div>
  );
};

export default EventsPage;
