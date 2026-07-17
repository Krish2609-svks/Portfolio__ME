export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Projects", value: "12" },
          { label: "Drafts", value: "3" },
          { label: "Unread Messages", value: "5" },
          { label: "Storage Used", value: "45%" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm">
            <p className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm p-6 min-h-[400px]">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <p>No recent activity found in audit logs.</p>
        </div>
      </div>
    </div>
  );
}
