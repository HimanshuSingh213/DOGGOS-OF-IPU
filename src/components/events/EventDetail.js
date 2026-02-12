"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    X,
    Heart,
    Coins,
    Info,
    Megaphone,
    GraduationCap
} from 'lucide-react';

const EventDetail = ({ event, onClose }) => {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (event) {
            gsap.to(backdropRef.current, {
                opacity: 1,
                duration: 0.3
            });
            gsap.fromTo(modalRef.current,
                {
                    scale: 0.9,
                    opacity: 0,
                    y: 20
                },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                }
            );

            const elements = contentRef.current?.querySelectorAll('.animate-item');
            if (elements) {
                gsap.fromTo(elements,
                    {
                        opacity: 0,
                        x: -10
                    },
                    {
                        opacity: 1,
                        x: 0,
                        stagger: 0.1,
                        delay: 0.2,
                        duration: 0.4
                    }
                );
            }
        }
    }, [event]);

    useEffect(() => {
        if (!event) return;
    
        window.history.pushState({ modalOpen: true }, "");
    
        const handlePopState = () => {
            handleClose();
        };
    
        window.addEventListener("popstate", handlePopState);
    
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [event]);
    

    const handleClose = () => {
        gsap.to(modalRef.current, {
            scale: 0.9,
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: onClose
        });
        gsap.to(backdropRef.current, {
            opacity: 0,
            duration: 0.3
        });

        if (window.history.state?.modalOpen) {
            window.history.back();
        }
    };

    if (!event) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div ref={backdropRef} className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0" onClick={handleClose} />

            {/* Modal Container */}
            <div ref={modalRef} className="relative w-full md:max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl opacity-0 border border-(--border-light) overflow-hidden flex flex-col">

                {/* Scrollable Area */}
                <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-(--primary-teal)/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-white [&::-webkit-scrollbar-thumb]:bg-clip-padding hover:[&::-webkit-scrollbar-thumb]:bg-(--primary-teal)/80">

                    {/* Event Image & Header */}
                    <div className="relative h-64 w-full bg-(--accent-peach)">
                        <img src={event.image_url || "/placeholder.jpg"} alt={event.title} className="w-full h-full object-cover" />

                        <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-gray-700 transition-colors shadow-sm">
                            <X size={20} />
                        </button>

                        <div className="absolute bottom-4 left-4 p-3 rounded-2xl shadow-lg flex items-center gap-2 bg-(--primary-teal) text-white">
                            {event.event_type === 'adoption_drive' && <Heart size={18} />}
                            {event.event_type === 'fundraiser' && <Coins size={18} />}
                            {event.event_type === 'awareness' && <Megaphone size={18} />}
                            {event.event_type === 'training' && <GraduationCap size={18} />}
                            {(!event.event_type || event.event_type === 'general') && <Info size={18} />}
                            <span className="font-bold text-xs uppercase tracking-wider">{event.event_type?.replace('_', ' ') || "Event"}</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div ref={contentRef} className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold animate-item opacity-0 heading-font text-(--text-dark)">{event.title}</h2>
                            <span className="animate-item opacity-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-(--secondary-green) shadow-sm">
                                {event.status}
                            </span>
                        </div>

                        <p className="text-(--text-gray) mb-8 leading-relaxed animate-item opacity-0 font-inter">
                            {event.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Logistics */}
                            <div className="space-y-4 animate-item opacity-0 font-inter">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-50 text-(--primary-teal)">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                                        <p className="font-bold text-gray-700">{event.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-50 text-(--accent-coral)">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                        <p className="font-bold text-gray-700">{event.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 text-gray-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</p>
                                        <p className="font-bold text-gray-700 line-clamp-1">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Capacity & Contact */}
                            <div className="space-y-4 animate-item opacity-0 font-inter">
                                {event.max_participants && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-amber-50 text-(--secondary-yellow)">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Capacity</p>
                                            <p className="font-bold text-gray-700">{event.max_participants} People</p>
                                        </div>
                                    </div>
                                )}
                                {(event.contact_email || event.contact_phone) && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Contact</p>
                                        <div className="space-y-1">
                                            {event.contact_email && <p className="text-xs font-semibold text-gray-600 truncate">{event.contact_email}</p>}
                                            {event.contact_phone && <p className="text-xs font-semibold text-gray-600">{event.contact_phone}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
