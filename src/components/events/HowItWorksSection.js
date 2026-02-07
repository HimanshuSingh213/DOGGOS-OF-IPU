import React from 'react'
import {  Search, Heart, Award } from "lucide-react";

function HowItWorksSection() {
  return (
    <div id='HowItWorks' className='bg-(--base-white) py-24'>
        {/* Max-width wrapper */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6'>
          {/* Heading */}
          <div className='w-full flex items-center justify-center'>
            <div className='relative'>
              <header className='w-full text-2xl md:text-5xl font-bold py-4 text-center md:text-left'>How medical care works</header>

              {/* Underline */}
              <div className='h-1 w-1/5 flex items-center justify-center absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-xl bg-(--secondary-yellow)'></div>
            </div>
          </div>

          <section className="py-20">
            <div className="mx-auto max-w-6xl px-4">

              {/* Steps */}
              <div className="grid gap-8 md:grid-cols-3">

                {/* Step 1 */}
                <div className="flex md:flex-row flex-col gap-4">
                  <div className='rounded-3xl bg-teal-50 p-8 border-2 border-(--border-light) relative'>
                    <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-(--primary-teal) text-(--base-white)">
                      <Search className='size-6' />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Spot a Dog in Need</h3>
                    <p className="text-sm text-(--text-gray)">
                      You notice an injured or sick dog on campus that needs help.
                    </p>

                    {/* Step No. */}
                    <div className='size-6 p-1 text-sm text-white font-bold'>1</div>
                  </div>
                  <div className='pt-8 hidden md:block text-(--earthy-brown)'>→</div>
                </div>

                {/* Step 2 */}
                <div className='flex md:flex-row flex-col gap-4'>
                  <div className="rounded-3xl bg-rose-50 p-8 border-2 border-(--border-light)">
                    <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-(--accent-coral) text-(--base-white)">
                      <Heart className='size-6' />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Report the Case</h3>
                    <p className="text-sm text-(--text-gray)">
                      Call our helpline or message us with the location and condition.
                    </p>
                  </div>
                  <div className='pt-8 hidden md:block text-(--earthy-brown)'>→</div>
                </div>

                {/* Step 3 */}
                <div className="rounded-3xl bg-emerald-50 p-8 border-2 border-(--border-light)">
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-full bg-(--secondary-green) text-(--base-white)">
                    <Award className='size-6'/>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">We Take Action</h3>
                  <p className="text-sm text-(--text-gray)">
                    Our team arrives quickly to provide medical care and treatment.
                  </p>
                </div>

              </div>
            </div>
          </section>


        </div>
      </div>
  )
}

export default HowItWorksSection