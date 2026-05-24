

const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-indigo-950 relative overflow-hidden border-r border-slate-200 group">
        {/* Animated Background Elements */}
        <div className="absolute -top-30 -left-30 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-[pulse-slow_6s_ease-in-out_infinite] transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_reverse] transition-transform duration-1000 group-hover:translate-x-10"></div>
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite] transition-transform duration-1000 group-hover:-translate-y-10"></div>
            
        <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full backdrop-blur-[2px]">
            <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-8 border border-white/10 shadow-xl transition-transform duration-500 hover:scale-105 hover:rotate-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                    <span className="text-white font-bold text-xl tracking-wider">EMS</span>
                </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                Employee <br /> Management System
            </h1>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed transition-all duration-500 group-hover:text-slate-300 group-hover:translate-x-2 delay-75">
                Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.
            </p>


        </div>
    </div>
  )
}

export default LoginLeftSide