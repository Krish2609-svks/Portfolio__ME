"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Save, Trash2, Edit2, Loader2, GripVertical, Eye, EyeOff, Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
  display_order: number;
  published: boolean;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) setItems(data);
    setIsLoading(false);
  };

  const handleAdd = () => {
    const newItem: GalleryItem = {
      id: `new-${Date.now()}`,
      title: "",
      image_url: "",
      category: "",
      display_order: items.length,
      published: true
    };
    setItems([...items, newItem]);
    setEditingId(newItem.id);
  };

  const handleDelete = async (id: string) => {
    if (!id.startsWith('new-')) {
      await supabase.from('gallery').delete().eq('id', id);
    }
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = async (item: GalleryItem) => {
    setIsSaving(true);
    const isNew = item.id.startsWith('new-');
    const { id, ...dataToSave } = item;
    
    if (isNew) {
      const { data } = await supabase.from('gallery').insert([dataToSave]).select().single();
      if (data) {
        setItems(items.map(i => i.id === item.id ? data : i));
      }
    } else {
      await supabase.from('gallery').update(dataToSave).eq('id', item.id);
    }
    
    setEditingId(null);
    setIsSaving(false);
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Gallery</h1>
          <p className="text-sm text-zinc-400">Manage portfolio images and visuals.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-zinc-500 py-10">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className={`bg-zinc-950 border ${item.published ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'} rounded-xl p-4 flex gap-4 items-start shadow-sm transition-all`}>
                <div className="mt-2 text-zinc-500 cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {/* Thumbnail Preview */}
                <div className="w-24 h-24 bg-zinc-900 rounded-md overflow-hidden flex items-center justify-center border border-zinc-800 flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-zinc-700" />
                  )}
                </div>

                {editingId === item.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <label className="block text-xs text-zinc-400 mb-1">Title</label>
                      <input type="text" value={item.title} onChange={e => setItems(items.map(x => x.id === item.id ? { ...x, title: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Image URL</label>
                      <input type="text" value={item.image_url} onChange={e => setItems(items.map(x => x.id === item.id ? { ...x, image_url: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Category</label>
                      <input type="text" value={item.category || ""} onChange={e => setItems(items.map(x => x.id === item.id ? { ...x, category: e.target.value } : x))} className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-white" />
                    </div>
                    <div className="col-span-full flex items-center">
                      <input type="checkbox" id={`pub-${item.id}`} checked={item.published} onChange={e => setItems(items.map(x => x.id === item.id ? { ...x, published: e.target.checked } : x))} className="mr-2" />
                      <label htmlFor={`pub-${item.id}`} className="text-sm text-zinc-400">Published (Visible on site)</label>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      {!item.published && <span className="text-xs text-amber-500 flex items-center gap-1"><EyeOff className="w-3 h-3"/> Hidden</span>}
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">Category: {item.category || 'Uncategorized'}</p>
                    <p className="text-xs text-zinc-500 break-all truncate max-w-xl">{item.image_url}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {editingId === item.id ? (
                    <button onClick={() => handleSave(item)} disabled={isSaving} className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-md transition-colors">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button onClick={() => setEditingId(item.id)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-zinc-800 rounded-md transition-colors">
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
