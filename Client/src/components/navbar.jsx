function Navbar() {
    //tailwind css and svg tags created with help of tailwind css
    return(
        <header className = "sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop blur"> 
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop blur">
            <div className="flex items-center justify-between p-4 h-20 sm:px-8">
                <div className="flex items-center w-full max-w-xl gap-3 rounded-xl border border-slate-300 bg-white p-2 shadow-sm">
                    <input type="text" placeholder="Search patients by name, ID, or email..." className="bg-transparent border-none focus:outline-none min-w-0 flex-1 text-sm text-slate-600 placeholder:text-slate-400" />
                    <button>Search</button>
                </div>
                <div className = "flex shrink-0 items-center gap-4 sm:gap-6">
                    <button type = "button" className = "relative rounded-full bg-slate-200 p-2 text-slate-600 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                </div >
            </div>
            <div className = "hidden h-9 w-px bg-slate-300 sm:block"/>
            <div>
               <button type = "button" className = "relative rounded-full bg-slate-200 p-2 text-slate-600 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </button>
                <div>{/* User Name */}</div>

            </div>
        </div>
        </header>
    )
}

export default Navbar;