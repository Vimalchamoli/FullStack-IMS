import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading";
import PayslipList from "../components/payslip/PayslipList";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Payslips = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN";

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await api.get('/payslips')
      setPayslips(res.data.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEmployeesForPayslip = useCallback(async () => {
    if (!isAdmin) return;
    try {
      setLoadingEmployees(true);
      const res = await api.get('/employees')
      setEmployees(res.data.data || res.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      setLoadingEmployees(false);
    }
  }, [isAdmin])

  useEffect(() => {
    fetchPayslips()
  }, [fetchPayslips])

  useEffect(() => {
    fetchEmployeesForPayslip()
  }, [fetchEmployeesForPayslip])

  if (loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">Your payslip history</p>
        </div>

        {isAdmin && (
          <div className="w-full sm:w-auto">
            {!loadingEmployees && employees?.length > 0 ? (
              <GeneratePayslipForm
                employees={employees}
                onSuccess={fetchPayslips}
              />
            ) : (
              <button className="btn-primary" disabled>
                Loading employees...
              </button>
            )}
          </div>
        )}
      </div>

      <PayslipList
        payslips={payslips}
        isAdmin={isAdmin}
        onDeleted={fetchPayslips}
      />
    </div>
  )
}



export default Payslips



