import { format } from 'date-fns'
import { Download, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const PayslipList = ({ payslips, isAdmin, onDeleted }) => {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (payslip) => {
    const id = payslip._id || payslip.id
    if (!id) return

    const ok = window.confirm('Delete this payslip?')
    if (!ok) return

    try {
      setDeletingId(id)
      await api.delete(`/payslips/${id}`)
      toast.success('Payslip deleted')
      onDeleted?.()
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className='card overflow-hidden'>
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th className='text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-center py-12 text-slate-400">
                  No payslips found
                </td>
              </tr>
            ) : (
              payslips.map((payslip) => {
                return (
                  <tr key={payslip._id || payslip.id}>
                    {isAdmin && (
                      <td className='text-slate-900'>
                        {payslip.employee?.firstName} {payslip.employee?.lastName}
                      </td>
                    )}

                    <td className='text-slate-500'>
                      {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
                    </td>

                    <td className='text-slate-500'>
                      {payslip.basicSalary?.toLocaleString()}
                    </td>

                    <td className='font-medium text-slate-800'>
                      {payslip.netSalary?.toLocaleString()}
                    </td>

                    <td className='text-center'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() => window.open(`/print/payslips/${payslip._id || payslip.id}`)}
                          className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors ring-1 ring-blue-600/10'>
                          <Download className="w-3 h-3 mr-1.5" /> Download
                        </button>

                        {isAdmin && (
                          <button
                            disabled={deletingId === (payslip._id || payslip.id)}
                            onClick={() => handleDelete(payslip)}
                            className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors ring-1 ring-rose-600/10 disabled:opacity-60'>
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PayslipList
