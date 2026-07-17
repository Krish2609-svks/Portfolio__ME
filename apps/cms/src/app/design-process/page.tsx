"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Save, Trash2, Edit2, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";

interface DesignProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  display_order: number;
  published: boolean;
}

export default function DesignProcessPage() {
  const [steps, setSteps] = useState<DesignProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('design_process')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) setSteps(data);
    setIsLoading(false);
  };

  const handleAdd = () => {
    const newStep: DesignProcessStep = {
      id: `new-${Date.now()}`,
      number: `0${steps.length + 1}`,
      title: "",
      description: "",
      display_order: steps.length,
      published: true
    };
    setSteps([...steps, newStep]);
    setEditingId(newStep.id);
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new-')) {
      await supabase.from('design_process').delete().eq('id', id);
    }
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSave = async (step: DesignProcessStep) => {
    setIsSaving(true);
    const isNew = step.id.startsWith('new-');
    const { id, ...dataToSave } = step;
    
    if (isNew) {
      const { data } = await supabase.from('design_process').insert([dataToSave]).select().single();
      if (data) {
        setSteps(steps.map(s => s.id === step.id ? data : s));
      }
    } else {
      await supabase.from('design_process').update(dataToSave).eq('id', step.id);
    }
    
    setEditingId(null);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Design Process</h1>
          <p className="text-sm text-zinc-400">Manage the steps shown in your Design Process section.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Step
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-zinc-500 py-10">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {steps.map((step) => (
              <div key={step.id} className={`bg-zinc-950 border ${step.published ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'} rounded-xl p-4 flex gap-4 items-start shadow-sm transition-all`}>
                <div className="mt-2 text-zinc-500 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {editingId === step.id ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Step Number (e.g., "01")</label>
                      <input type="text" value={step.number} onChange={e => setSteps(steps.map(s => s.id === step.id ? { ...s, number: e.target.value } : s))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Title</label>
                      <input type="text" value={step.title} onChange={e => setSteps(steps.map(s => s.id === step.id ? { ...s, title: e.target.value } : s))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div className="col-span-full">
                      <label className="block text-xs text-zinc-400 mb-1">Description</label>
                      <textarea value={step.description} onChange={e => setSteps(steps.map(s => s.id === step.id ? { ...s, description: e.target.value } : s))} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div className="col-span-full flex items-center">
                      <input type="checkbox" id={`pub-${step.id}`} checked={step.published} onChange={e => setSteps(steps.map(s => s.id === step.id ? { ...s, published: e.target.checked } : s))} className="mr-2" />
                      <label htmlFor={`pub-${step.id}`} className="text-sm text-zinc-400">Published (Visible on site)</label>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-accent-primary font-mono font-bold">{step.number}</span>
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      {!step.published && <span className="text-xs text-amber-500 flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hidden</span>}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === step.id ? (
                    <button onClick={() => handleSave(step)} disabled={isSaving} className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-md transition-colors">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button onClick={() => setEditingId(step.id)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(step.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-zinc-800 rounded-md transition-colors">
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
