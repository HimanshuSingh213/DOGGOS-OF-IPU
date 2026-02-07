
function EventCardSkeleton() {
    return (
        <div className="animate-pulse rounded-3xl border w-xs border-gray-300 bg-gray-50 p-5">

            {/* image */}
            <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-gray-200" />

            {/* badge */}
            <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-gray-200" />

            {/* title */}
            <div className="mx-auto mb-2 h-4 w-3/4 rounded bg-gray-300" />
            <div className="mx-auto mb-4 h-4 w-1/2 rounded bg-gray-300" />

            {/* meta rows */}
            <div className="space-y-2">
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>

            {/* button */}
            <div className="mt-5 h-10 w-full rounded-full bg-gray-300" />
        </div>
    );
}

export default EventCardSkeleton