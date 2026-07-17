"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Save, Trash2, Edit2, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
  published: boolean;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) setSkills(data);
    setIsLoading(false);
  };

  const handleAdd = () => {
    const newSkill: Skill = {
      id: `new-${Date.now()}`,
      name: "",
      category: "Frontend",
      display_order: skills.length,
      published: true
    };
    setSkills([...skills, newSkill]);
    setEditingId(newSkill.id);
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new-')) {
      await supabase.from('skills').delete().eq('id', id);
    }
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleSave = async (skill: Skill) => {
    setIsSaving(true);
    const isNew = skill.id.startsWith('new-');
    const { id, ...dataToSave } = skill;
    
    if (isNew) {
      const { data } = await supabase.from('skills').insert([dataToSave]).select().single();
      if (data) {
        setSkills(skills.map(s => s.id === skill.id ? data : s));
      }
    } else {
      await supabase.from('skills').update(dataToSave).eq('id', skill.id);
    }
    
    setEditingId(null);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Skills</h1>
          <p className="text-sm text-zinc-400">Manage technical skills and categories.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-zinc-500 py-10">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className={`bg-zinc-950 border ${skill.published ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'} rounded-xl p-4 flex gap-4 items-start shadow-sm transition-all`}>
                <div className="mt-2 text-zinc-500 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {editingId === skill.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Name</label>
                      <input type="text" value={skill.name} onChange={e => setSkills(skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Category</label>
                      <input type="text" value={skill.category} onChange={e => setSkills(skills.map(s => s.id === skill.id ? { ...s, category: e.target.value } : s))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div className="col-span-full flex items-center">
                      <input type="checkbox" id={`pub-${skill.id}`} checked={skill.published} onChange={e => setSkills(skills.map(s => s.id === skill.id ? { ...s, published: e.target.checked } : s))} className="mr-2" />
                      <label htmlFor={`pub-${skill.id}`} className="text-sm text-zinc-400">Published (Visible on site)</label>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{skill.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-xs text-zinc-300 border border-zinc-700">{skill.category}</span>
                      {!skill.published && <span className="text-xs text-amber-500 flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hidden</span>}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === skill.id ? (
                    <button onClick={() => handleSave(skill)} disabled={isSaving} className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-md transition-colors">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button onClick={() => setEditingId(skill.id)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-zinc-800 rounded-md transition-colors">
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
