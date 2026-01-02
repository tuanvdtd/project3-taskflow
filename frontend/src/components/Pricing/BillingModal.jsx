import React, { useState } from 'react'
import { X, Lock, Check, ShieldCheck } from 'lucide-react'
import Button from '@mui/material/Button'
import { format, addMonths, addYears } from 'date-fns'
import { createPaymentAPI } from '~/apis'

export function BillingModal({
  open,
  onClose,
  plan,
  billingPeriod
}) {
  const [processing, setProcessing] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      planCode: plan.name,
      billingCycle: billingPeriod,
      paymentProvider: 'vnpay',
      amount: billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice * 12
    }
    // console.log(data)
    setProcessing(true)
    const { success, paymentUrl } = await createPaymentAPI(data)
    if (success) {
      window.location.href = paymentUrl
    } else {
      alert('Error creating payment. Please try again.')
    }
    setProcessing(false)
    onClose()
  }

  const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  const totalAmount = billingPeriod === 'monthly' ? price : price * 12
  const expirationDate = billingPeriod === 'monthly'
    ? addMonths(new Date(), 1)
    : addYears(new Date(), 1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl z-10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <h2 className="text-gray-900 mb-2">Upgrade to {plan.name}</h2>
          <p className="text-gray-600">
            Get unlimited access to all Pro features and take your productivity to the next level.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            {/* Plan Details */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-gray-900">{plan.name} Plan</h4>
                  <p className="text-sm text-gray-600 capitalize">{billingPeriod} billing</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl text-gray-900">{totalAmount.toLocaleString('vi-VN')}₫</div>
                  <div className="text-sm text-gray-600">
                    {billingPeriod === 'monthly' ? '/ month' : '/ year'}
                  </div>
                </div>
              </div>

              {billingPeriod === 'yearly' && (
                <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Save 20% with annual billing
                </div>
              )}

              {/* Expiration Date */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next billing date</span>
                  <span className="text-gray-900">{format(expirationDate, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-900">Total due today</span>
                <span className="text-2xl text-gray-900">{totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900">Secure Payment</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment will be processed securely. You can cancel your subscription at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-6 rounded-b-2xl">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-600 text-center">
                By upgrading, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription at any time.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onClose}
                  disabled={processing}
                  sx={{
                    flex: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      backgroundColor: '#f9fafb'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={processing}
                  sx={{
                    flex: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                    }
                  }}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                     Confirm & Pay
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}