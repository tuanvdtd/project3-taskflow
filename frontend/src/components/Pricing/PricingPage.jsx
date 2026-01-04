import React, { useState } from 'react'
import { Check, Sparkles, ArrowLeft } from 'lucide-react'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { BillingModal } from './BillingModal'


const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for individuals or small teams',
    features: [
      { text: 'Up to 10 boards', included: true },
      { text: 'Basic task management', included: true },
      { text: 'Limited collaborators (up to 5)', included: true },
      { text: 'Basic labels and due dates', included: true },
      { text: 'File attachments', included: false },
      { text: 'Custom backgrounds', included: false }
    ],
    ctaText: 'Get Started',
    ctaVariant: 'outlined'
  },
  {
    name: 'Pro',
    monthlyPrice: 100000,
    yearlyPrice: 80000,
    description: 'Best for growing teams and professionals',
    features: [
      { text: 'Unlimited boards', included: true },
      { text: 'Unlimited collaborators', included: true },
      { text: 'Advanced labels & filters', included: true },
      { text: 'Due dates & reminders', included: true },
      { text: 'File attachments (up to 250MB)', included: true },
      { text: 'Custom backgrounds & themes', included: true }
    ],
    ctaText: 'Upgrade to Pro',
    ctaVariant: 'contained',
    popular: true,
    highlight: true
  }
]

export function PricingPage({ onBack }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const currentUser = useSelector(selectCurrentUser)
  const currentPlanKey = (currentUser?.plan || 'free').toLowerCase()

  const handleUpgradeClick = (plan) => {
    if (plan.name === 'Pro') {
      setSelectedPlan(plan)
      setShowBillingModal(true)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-slate-900 mb-4">Choose Your Plan</h1>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Select the perfect plan for your team. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Current plan indicator */}
          <div className="flex items-center justify-center mb-6 gap-3 text-sm">
            <span className="text-slate-600">Current plan:</span>
            <Chip
              label={currentPlanKey === 'pro' ? 'Pro' : 'Free'}
              color={currentPlanKey === 'pro' ? 'primary' : 'default'}
              variant={currentPlanKey === 'pro' ? 'filled' : 'outlined'}
              size="small"
            />
          </div>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-1.5 shadow-sm border border-slate-200">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => {
            const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
            const isCurrentPlan = plan.name.toLowerCase() === currentPlanKey

            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 ${
                  plan.highlight ? 'ring-2 ring-blue-600 md:scale-105' : ''
                } ${isCurrentPlan ? 'border-2 border-emerald-500' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 shadow-sm">
                      Current plan
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{plan.description}</p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl text-slate-900">
                      {price === 0 ? 'Miễn phí' : `${price.toLocaleString('vi-VN')}₫`}
                    </span>
                    <div className="text-slate-600">
                      {price > 0 && <span>/ tháng</span>}
                      {billingPeriod === 'yearly' && price > 0 && (
                        <div className="text-xs text-green-600">
                          Thanh toán {(price * 12).toLocaleString('vi-VN')}₫/năm
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.ctaVariant}
                  fullWidth
                  disabled={isCurrentPlan}
                  sx={{
                    mb: 4,
                    py: 1.5,
                    textTransform: 'none',
                    borderRadius: '12px',
                    ...(isCurrentPlan && {
                      opacity: 0.7,
                      cursor: 'default'
                    }),
                    ...(plan.ctaVariant === 'contained' && {
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                      }
                    }),
                    ...(plan.ctaVariant === 'outlined' && {
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      borderWidth: '2px',
                      '&:hover': {
                        borderWidth: '2px',
                        borderColor: '#1565c0',
                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                      }
                    })
                  }}
                  onClick={() => {
                    if (!isCurrentPlan) handleUpgradeClick(plan)
                  }}
                >
                  {isCurrentPlan
                    ? plan.name === 'Pro'
                      ? 'Bạn đang ở gói Pro'
                      : 'Bạn đang ở gói Free'
                    : plan.ctaText}
                </Button>

                {isCurrentPlan && (
                  <p className="text-xs text-emerald-600 mb-4 text-center">
                    Đây là gói hiện tại của bạn.
                  </p>
                )}

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        !feature.included ? 'opacity-40' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-700 text-sm leading-tight">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="text-slate-900 mb-2">Can I change plans later?</h4>
              <p className="text-slate-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any payments.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-600 text-sm">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 mb-2">Is there a free trial for Pro?</h4>
              <p className="text-slate-600 text-sm">
                The Free plan is available forever. Pro plan comes with a 14-day free trial—no credit card required.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-slate-600 text-sm">
                Absolutely! You can cancel your subscription at any time. If you cancel, you'll have access to your Pro features until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="text-slate-900 mb-2">Do you offer discounts for nonprofits or education?</h4>
              <p className="text-slate-600 text-sm">
                Yes! We offer special pricing for nonprofits and educational institutions. Contact our support team for more information.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            Need help choosing? Our team is here to help.
          </p>
          <Button
            variant="text"
            sx={{
              color: '#1976d2',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Contact Support →
          </Button>
        </div>
      </div>
      {showBillingModal && selectedPlan && (
        <BillingModal
          open={showBillingModal}
          plan={selectedPlan}
          billingPeriod={billingPeriod}
          onClose={() => setShowBillingModal(false)}
        />
      )}
    </div>
  )
}