"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Save, Trash2, Edit2, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  display_order: number;
  published: boolean;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) setExperiences(data);
    setIsLoading(false);
  };

  const handleAdd = () => {
    const newExp: Experience = {
      id: `new-${Date.now()}`,
      role: "",
      company: "",
      location: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      current: true,
      description: "",
      display_order: experiences.length,
      published: true
    };
    setExperiences([...experiences, newExp]);
    setEditingId(newExp.id);
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new-')) {
      await supabase.from('experience').delete().eq('id', id);
    }
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleSave = async (exp: Experience) => {
    setIsSaving(true);
    const isNew = exp.id.startsWith('new-');
    const { id, ...dataToSave } = exp;
    
    if (isNew) {
      const { data } = await supabase.from('experience').insert([dataToSave]).select().single();
      if (data) {
        setExperiences(experiences.map(e => e.id === exp.id ? data : e));
      }
    } else {
      await supabase.from('experience').update(dataToSave).eq('id', exp.id);
    }
    
    setEditingId(null);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Experience</h1>
          <p className="text-sm text-zinc-400">Manage work history and professional roles.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-zinc-500 py-10">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {experiences.map((exp) => (
              <div key={exp.id} className={`bg-zinc-950 border ${exp.published ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'} rounded-xl p-4 flex gap-4 items-start shadow-sm transition-all`}>
                <div className="mt-2 text-zinc-500 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {editingId === exp.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Role</label>
                      <input type="text" value={exp.role} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, role: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Company</label>
                      <input type="text" value={exp.company} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Location</label>
                      <input type="text" value={exp.location} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, location: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Start Date</label>
                      <input type="date" value={exp.start_date} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, start_date: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-zinc-400 mb-1">End Date</label>
                        <input type="date" value={exp.end_date || ""} disabled={exp.current} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, end_date: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white disabled:opacity-50" />
                      </div>
                      <div className="flex items-center mt-5">
                        <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, current: e.target.checked, end_date: e.target.checked ? null : x.end_date } : x))} className="mr-2" />
                        <label htmlFor={`current-${exp.id}`} className="text-sm text-zinc-400">Current</label>
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label className="block text-xs text-zinc-400 mb-1">Description (Markdown)</label>
                      <textarea rows={4} value={exp.description} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div className="col-span-full flex items-center">
                      <input type="checkbox" id={`pub-${exp.id}`} checked={exp.published} onChange={e => setExperiences(experiences.map(x => x.id === exp.id ? { ...x, published: e.target.checked } : x))} className="mr-2" />
                      <label htmlFor={`pub-${exp.id}`} className="text-sm text-zinc-400">Published (Visible on site)</label>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{exp.role} <span className="text-blue-500">@ {exp.company}</span></h3>
                      {!exp.published && <span className="text-xs text-amber-500 flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hidden</span>}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-zinc-400">{exp.location}</p>
                      <span className="text-xs text-zinc-500">
                        {new Date(exp.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {exp.current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">{exp.description}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === exp.id ? (
                    <button onClick={() => handleSave(exp)} disabled={isSaving} className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-md transition-colors">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button onClick={() => setEditingId(exp.id)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-zinc-800 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
