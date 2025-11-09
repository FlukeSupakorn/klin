export function NotificationSettings() {
  const notifications = [
    { label: 'Email notifications', description: 'Receive email updates about your files' },
    { label: 'Push notifications', description: 'Get notified about important updates' },
    { label: 'File sharing alerts', description: 'When someone shares a file with you' },
    { label: 'Storage alerts', description: "When you're running out of storage" },
    { label: 'Security alerts', description: 'Unusual account activity and security updates' },
  ]

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Settings</h2>
      
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600" />
            <div className="flex-1">
              <div className="font-medium text-slate-900">{item.label}</div>
              <div className="text-sm text-slate-600">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
