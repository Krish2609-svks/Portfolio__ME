"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Plus, Edit2, Globe, Lock, Trash2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  status: string;
  published: boolean;
  updated_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      const { data } = await supabase
        .from('projects')
        .select('id, title, status, published, updated_at')
        .order('updated_at', { ascending: false });
      
      if (data) setProjects(data);
      setIsLoading(false);
    }
    fetchProjects();
  }, [supabase]);

  const handleCreate = async () => {
    const { data, error } = await supabase.from('projects').insert([
      { title: 'New Project', slug: `new-project-${Date.now()}`, status: 'draft' }
    ]).select().single();
    
    if (data) {
      window.location.href = `/projects/${data.id}`;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </button>
      </div>

      <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No projects found. Create one to get started!</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Title</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-zinc-400">Last Modified</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-200">{project.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.published 
                        ? 'bg-green-900/30 text-green-400 border border-green-800' 
                        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                    }`}>
                      {project.published ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {project.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/projects/${project.id}`} className="inline-flex items-center text-blue-500 hover:text-blue-400">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(project.id)} className="inline-flex items-center text-red-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
