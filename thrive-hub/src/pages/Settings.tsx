import Header from '../components/Header';

export default function Settings() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Business configuration and preferences" />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {[
            { section:'Business Info', fields:['Business Name','Address','Phone','Email'] },
            { section:'Notifications', fields:['Booking reminders','Cancellation alerts','Revenue reports'] },
            { section:'Billing', fields:['Payment methods','Invoice settings','Tax configuration'] },
          ].map(({ section, fields }) => (
            <div key={section} className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{section}</h2>
              <div className="space-y-2">
                {fields.map(f => (
                  <div key={f} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{f}</span>
                    <button className="text-xs text-green-600 font-medium">Configure</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
