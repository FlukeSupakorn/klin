import { Button } from '@/components/ui/button'
import { Settings, Bell, Check, Zap, Crown, Rocket } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Zap,
    iconColor: 'text-slate-600',
    bgColor: 'bg-slate-100',
    features: [
      '5 GB Storage',
      'Up to 10 files',
      'Basic file sharing',
      'Email support',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    icon: Crown,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    features: [
      '100 GB Storage',
      'Unlimited files',
      'Advanced sharing & permissions',
      'Priority support',
      'File version history',
      'Advanced analytics',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: 'per month',
    icon: Rocket,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    features: [
      'Unlimited Storage',
      'Unlimited files',
      'All Pro features',
      '24/7 dedicated support',
      'Custom integrations',
      'Advanced security',
      'Team collaboration',
    ],
  },
]

export function SubscriptionPage() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Subscription Plans</h1>
            <p className="text-sm text-slate-500 mt-1">Choose the perfect plan for your needs</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon
              return (
                <div
                  key={plan.name}
                  className={`bg-white border-2 rounded-2xl p-8 relative ${
                    plan.popular ? 'border-indigo-600 shadow-xl' : 'border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  {plan.current && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className={`h-16 w-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`h-8 w-8 ${plan.iconColor}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 ml-2">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade Now'}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Storage Usage */}
          <div className="mt-12 bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Usage</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Storage Used</span>
                  <span className="text-sm font-semibold text-slate-900">3.8 GB / 5 GB</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600" style={{ width: '76%' }} />
                </div>
              </div>
              <Button variant="outline">Manage Storage</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
