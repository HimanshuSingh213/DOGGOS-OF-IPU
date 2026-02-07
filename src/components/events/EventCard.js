"use client"
import React, { useEffect, useState } from 'react'
import { Calendar, Clock, MapPin } from "lucide-react";

const CTAButton = ({ buttonText, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-[#042839] w-full py-2 px-8 flex items-center justify-center text-base font-semibold font-inter cursor-pointer text-white rounded-3xl"
        >
            {buttonText}
        </button>
    );
};

function randomColorSelector() {
    const colors = [
        '--primary-teal',
        '--secondary-green',
        '--secondary-yellow',
        '--accent-coral',
    ];

    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
}



function EventCard({ event, onCTAClick }) {

    const [TypeColor, setTypeColor] = useState("--accent-peach");

    useEffect(() => {
        setTypeColor(randomColorSelector());
    }, [])

    return (
        <div>
            <div className='relative overflow-hidden rounded-3xl bg-slate-50 flex flex-col items-center gap-4 p-6 md:w-xs w-full h-full event-card shadow-lg hover:shadow-2xl border-2 border-(--border-light) hover:border-(--primary-teal) transition duration-500 ease-in-out hover:-translate-y-2 group'>

                {/* <span className="absolute top-0 left-0 h-1 w-full  bg-(--accent-peach)" /> */}


                {/* Event Img */}
                <div className='relative w-full flex items-center justify-center'>
                    <div className='flex rounded-full items-center justify-center overflow-hidden size-32 border-4 border-white shadow-xl relative'>
                        <img
                            src={event.image_url} alt={event.title}
                            className='h-full w-full object-cover'
                        />
                    </div>

                    {/* Type */}
                    <div className={`bg-(${TypeColor}) font-inter text-white absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest shadow-md z-20`}>
                        {event.event_type || "Event"}
                    </div>
                </div>
                {/* Event Title */}
                <h3 className="text-[17px] font-bold text-center mb-6 heading-font leading-tight line-clamp-2">{event.title}</h3>

                {/* Event Details */}
                <div className='flex flex-col justify-start items-center space-y-2 mb-5 w-full'>
                    {/* Event Date */}
                    <div className='w-full flex justify-start items-center gap-2'>
                        <Calendar className='size-4 text-(--primary-teal)' />
                        <span className='text-xs text-(--text-gray) font-semibold font-inter truncate'>{event.date}</span>
                    </div>

                    {/* Event Location */}
                    <div className='w-full flex justify-start items-center gap-2'>
                        <MapPin className='size-4 text-(--accent-coral)' />
                        <span className='text-xs text-(--text-gray) font-semibold font-inter truncate'>{event.location}</span>
                    </div>

                    {/* Event Timing */}
                    <div className='w-full flex justify-start items-center gap-2'>
                        <Clock className='size-4 text-(--secondary-yellow)' />
                        <span className='text-xs text-(--text-gray) font-semibold font-inter truncate'>{event.time}</span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className='mt-auto w-full flex flex-col justify-center items-center transition duration-500 ease-in-out group-hover:-translate-y-1.5'>
                    {/* Button */}
                    <CTAButton
                        onClick={() => onCTAClick(event)}
                        redirect={event.redirect_link || "#"}
                        buttonText={event.button_text || "Learn More"}
                    />

                </div>
            </div>
        </div>
    )
}

export default EventCard