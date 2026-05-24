import { ArrowRightIcon, ShieldIcon, UserIcon } from "lucide-react"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "../components/Loading"


const LoginLanding = () => {

    const {user, loading} = useAuth()

  if(loading) return <Loading />
  if(user) return <Navigate to="/" />

    const portalOptions = [
        {
            to: "/login/admin",
            title: "Admin Portal",
            description: "Manage employees, departments, payroll, and system configurations.",
            icon: ShieldIcon
        },
        {
            to: "/login/employee",
            title: "Employee Portal",
            description: "View your profile, track attendance, request time off, and access payslips.",
            icon: UserIcon
        }
    ]

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-cover bg-center relative bg-slate-900"
      style={{ backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url('/login_bg.jpg')" }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl p-6 sm:p-10 animate-fade-in relative z-10">
          
          {/* Logo / Branding */}
          <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mb-3">
                  <span className="text-white font-bold text-lg tracking-wider">EMS</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Employee Management System</h1>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
              <p className="text-sm text-slate-500">Select your portal to securely access the system.</p>
          </div>

          <div className="space-y-4">
              {portalOptions.map((portal)=>(
                  <Link key={portal.to} to={portal.to} className="group block bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 sm:p-5 transition-all duration-300 hover:border-indigo-400 hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors duration-300">
                              <portal.icon className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                          </div>
                          <div>
                              <h3 className="text-base font-semibold text-slate-800 group-hover:text-indigo-600 mb-0.5 transition-colors">{portal.title}</h3>
                              <p className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-600">{portal.description}</p>
                          </div>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1.5 transition-all duration-300 shrink-0"/>
                  </div>
                  </Link>
              ))}
          </div>

      </div>
    </div>
  )
}

export default LoginLanding