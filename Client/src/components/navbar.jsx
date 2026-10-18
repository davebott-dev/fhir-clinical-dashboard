function Navbar() {
    // tailwind css and svg tags created with help of generative AI

    return (
        <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white shadow-sm">
            <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-8">

                {/* Search bar */}
                <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search patients by name, ID, or email..."
                        className="min-w-0 flex-1 border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    />
                    <button
                        type="button"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Search
                    </button>
                </div>

                <div className="flex shrink-0 items-center gap-3 sm:gap-5">

                    {/* Notifications */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    </button>

                    {/* Divider */}
                    <div className="hidden h-9 w-px bg-slate-200 sm:block" />

                    {/* User profile */}
                    <button
                        type="button"
                        className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                User Name
                            </p>
                            <p className="text-xs text-slate-500">
                                Clinical Dashboard
                            </p>
                        </div>
                    </button>

                </div>
            </div>
        </header>
    );
}

export default Navbar;