"use client";

import { useState, useEffect, useCallback, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Editor } from "@/components/Editor";
import { Save, Clock, ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    overview: "",
    problem_statement: "",
    published: false,
    status: "draft"
  });

  useEffect(() => {
    async function loadProject() {
      const { data } = await supabase.from('projects').select('*').eq('id', resolvedParams.id).single();
      if (data) {
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          overview: data.overview || "",
          problem_statement: data.problem_statement || "",
          published: data.published || false,
          status: data.status || "draft"
        });
      }
      
      const { data: vData } = await supabase.from('content_versions')
        .select('*')
        .eq('entity_id', resolvedParams.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (vData) setVersions(vData);
    }
    loadProject();
  }, [resolvedParams.id, supabase]);

  const handleSave = useCallback(async (auto = false) => {
    setIsSaving(true);
    const { error } = await supabase.from('projects').update(formData).eq('id', resolvedParams.id);
    
    if (!error) {
      setLastSaved(new Date());
      // Create version history snapshot
      const { data: newVersion } = await supabase.from('content_versions').insert({
        entity_type: 'project',
        entity_id: resolvedParams.id,
        snapshot: formData
      }).select().single();
      if (newVersion) setVersions(prev => [newVersion, ...prev].slice(0, 10));
    }
    setIsSaving(false);
  }, [formData, resolvedParams.id, supabase]);

  // Autosave every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [handleSave]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const restoreVersion = (snapshot: any) => {
    if (confirm("Restore this version? Unsaved changes will be lost.")) {
      setFormData(snapshot);
      setShowVersions(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/projects" className="p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Project</h1>
        </div>
        
        <div className="flex items-center space-x-4 relative">
          <span className="text-sm text-zinc-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : "Not saved yet"}
          </span>
          <button 
            onClick={() => setShowVersions(!showVersions)}
            className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors shadow-sm font-medium"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </button>
          
          {showVersions && (
            <div className="absolute top-12 right-0 w-64 bg-zinc-900 border border-zinc-700 rounded-md shadow-xl z-50 py-2">
              <h3 className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 mb-2">Recent Versions</h3>
              {versions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-zinc-500">No versions saved yet.</div>
              ) : (
                versions.map((v, idx) => (
                  <button 
                    key={v.id} 
                    onClick={() => restoreVersion(v.snapshot)}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    {new Date(v.created_at).toLocaleString()}
                  </button>
                ))
              )}
            </div>
          )}

          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm font-medium disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Slug</label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="preview">Preview</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <input 
                type="checkbox" 
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-700 rounded bg-zinc-900"
              />
              <label className="ml-2 block text-sm text-zinc-300">
                Make public on portfolio
              </label>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
          <Editor 
            value={formData.overview} 
            onChange={(val) => setFormData(prev => ({ ...prev, overview: val }))} 
          />
        </div>

        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Problem Statement</h2>
          <Editor 
            value={formData.problem_statement} 
            onChange={(val) => setFormData(prev => ({ ...prev, problem_statement: val }))} 
          />
        </div>
      </div>
    </div>
  );
}
