"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Save, Trash2, Edit2, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  display_order: number;
  published: boolean;
}

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('education')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) setEducations(data);
    setIsLoading(false);
  };

  const handleAdd = () => {
    const newEd: Education = {
      id: `new-${Date.now()}`,
      degree: "",
      institution: "",
      location: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      description: "",
      display_order: educations.length,
      published: true
    };
    setEducations([...educations, newEd]);
    setEditingId(newEd.id);
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new-')) {
      await supabase.from('education').delete().eq('id', id);
    }
    setEducations(educations.filter(e => e.id !== id));
  };

  const handleSave = async (ed: Education) => {
    setIsSaving(true);
    const isNew = ed.id.startsWith('new-');
    const { id, ...dataToSave } = ed;
    
    if (isNew) {
      const { data } = await supabase.from('education').insert([dataToSave]).select().single();
      if (data) {
        setEducations(educations.map(e => e.id === ed.id ? data : e));
      }
    } else {
      await supabase.from('education').update(dataToSave).eq('id', ed.id);
    }
    
    setEditingId(null);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Education</h1>
          <p className="text-sm text-zinc-400">Manage academic history and degrees.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-zinc-500 py-10">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {educations.map((ed) => (
              <div key={ed.id} className={`bg-zinc-950 border ${ed.published ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'} rounded-xl p-4 flex gap-4 items-start shadow-sm transition-all`}>
                <div className="mt-2 text-zinc-500 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {editingId === ed.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Degree</label>
                      <input type="text" value={ed.degree} onChange={e => setEducations(educations.map(x => x.id === ed.id ? { ...x, degree: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Institution</label>
                      <input type="text" value={ed.institution} onChange={e => setEducations(educations.map(x => x.id === ed.id ? { ...x, institution: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Location</label>
                      <input type="text" value={ed.location} onChange={e => setEducations(educations.map(x => x.id === ed.id ? { ...x, location: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Start Date</label>
                      <input type="date" value={ed.start_date} onChange={e => setEducations(educations.map(x => x.id === ed.id ? { ...x, start_date: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">End Date (Expected if future)</label>
                      <input type="date" value={ed.end_date || ""} onChange={e => setEducations(educations.map(x => x.id === ed.id ? { ...x, end_date: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div className="col-span-full flex items-center">
                      <input type="checkbox" id={`pub-${ed.id}`} checked={ed.published} onChange={e => setEducations(educations.map(x => x.id === ed.id ? { ...x, published: e.target.checked } : x))} className="mr-2" />
                      <label htmlFor={`pub-${ed.id}`} className="text-sm text-zinc-400">Published (Visible on site)</label>
                    </div>
                    <div className="col-span-full">
                      <label className="block text-xs text-zinc-400 mb-1">Description (Markdown)</label>
                      <textarea rows={3} value={ed.description} onChange={e => setEducations(educations.map(x => x.id === ed.id ? { ...x, description: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{ed.degree} <span className="text-blue-500">@ {ed.institution}</span></h3>
                      {!ed.published && <span className="text-xs text-amber-500 flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hidden</span>}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-zinc-400">{ed.location}</p>
                      <span className="text-xs text-zinc-500">
                        {new Date(ed.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - {ed.end_date ? new Date(ed.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present'}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">{ed.description}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === ed.id ? (
                    <button onClick={() => handleSave(ed)} disabled={isSaving} className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-md transition-colors">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button onClick={() => setEditingId(ed.id)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(ed.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-zinc-800 rounded-md transition-colors">
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
