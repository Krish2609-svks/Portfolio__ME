"use client";

export default function AuditLogsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
      </div>

      <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-8 text-center text-zinc-500">
          <p className="mb-2">Audit logs capture all administrative actions.</p>
          <p className="text-sm">They are currently empty because we haven't wired up the PostgreSQL triggers to populate this view yet.</p>
        </div>
      </div>
    </div>
  );
}
