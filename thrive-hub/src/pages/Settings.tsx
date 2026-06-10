import { useState } from 'react';
import { Database, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import { addMember, addBooking, addStaffMember, addService } from '../lib/db';
import { members as mockMembers, bookings as mockBookings, staff as mockStaff, services as mockServices } from '../data/mockData';

export default function Settings() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await Promise.all([
        ...mockMembers.map(({ id: _id, ...m }) => addMember(m)),
        ...mockStaff.map(({ id: _id, ...s }) => addStaffMember(s)),
        ...mockServices.map(({ id: _id, ...sv }) => addService(sv)),
        ...mockBookings.map(({ id: _id, ...b }) => addBooking(b)),
      ]);
      setSeeded(true);
    } catch {
      alert('Failed to seed data. Make sure Firebase is configured and Firestore rules allow writes.');
    }
    setSeeding(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Business configuration and preferences"/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Firebase Setup</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="text-xs text-gray-500">To connect live data, complete these steps once:</p>
            <ol className="space-y-2 text-xs text-gray-700 list-decimal list-inside">
              <li>Go to <strong>console.firebase.google.com</strong> and create a project</li>
              <li>Click <strong>Firestore Database</strong> → Create database → Start in test mode</li>
              <li>Click <strong>Project Settings</strong> → General → scroll to "Your apps" → Add web app</li>
              <li>Copy the <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">firebaseConfig</code> object</li>
              <li>Send it to me here in this chat and I will rebuild the app with your config</li>
            </ol>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-xs text-amber-700"><strong>Firestore Rules:</strong> In Firebase Console → Firestore → Rules, paste this:</p>
              <pre className="mt-2 text-xs bg-white rounded p-2 border border-amber-100 overflow-x-auto text-gray-600">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}</pre>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Sample Data</h2>
          <p className="text-xs text-gray-500 mb-3">Populate your database with sample members, bookings, staff, and services to explore the dashboard.</p>
          {seeded
            ? <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle size={16}/> Sample data added successfully!</div>
            : <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg disabled:opacity-50">
                <Database size={15}/>
                {seeding ? 'Adding sample data…' : 'Add Sample Data'}
              </button>
          }
        </div>

        {[
          { section:'Business Info', fields:['Business Name','Address','Phone','Email'] },
          { section:'Notifications', fields:['Booking reminders','Cancellation alerts','Revenue reports'] },
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
  );
}
