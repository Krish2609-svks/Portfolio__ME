"use client";

import { useState, useEffect } from "react";
import { Folder, File, Upload, Search, ChevronRight, Image as ImageIcon, FileText, Video } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface StorageItem {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata: Record<string, any> | null;
}

export default function MediaLibrary() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [items, setItems] = useState<StorageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const fetchItems = async () => {
    setIsLoading(true);
    const pathStr = currentPath.length === 0 ? '' : currentPath.join('/');
    const { data, error } = await supabase.storage.from('portfolio-media').list(pathStr, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (data) {
      setItems(data);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchItems();
  }, [currentPath, supabase]);

  const handleNavigate = (folder: string) => {
    setCurrentPath([...currentPath, folder]);
  };

  const handleNavigateUp = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const navigateToRoot = () => setCurrentPath([]);

  const getFileIcon = (fileName: string) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return <ImageIcon className="h-6 w-6 text-blue-400" />;
    if (fileName.match(/\.(mp4|webm|mov)$/i)) return <Video className="h-6 w-6 text-purple-400" />;
    return <FileText className="h-6 w-6 text-zinc-400" />;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'application/pdf'
    ];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not allowed. Only images, videos, and PDFs are permitted.`);
        continue;
      }
      
      const MAX_SIZE = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        alert(`File ${file.name} is too large. Max size is ${MAX_SIZE / (1024 * 1024)}MB.`);
        continue;
      }

      const pathStr = currentPath.length === 0 ? '' : currentPath.join('/') + '/';
      const filePath = `${pathStr}${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { error } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, { upsert: false });
        
      if (error) {
        alert(`Failed to upload ${file.name}: ${error.message}`);
      }
    }
    
    setIsUploading(false);
    e.target.value = '';
    fetchItems();
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Media Library</h1>
        <label className={`flex items-center px-4 py-2 ${isUploading ? 'bg-zinc-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md cursor-pointer transition-colors shadow-sm font-medium`}>
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload File'}
          <input type="file" className="hidden" multiple onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="flex items-center space-x-2 text-sm text-zinc-400 mb-6 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
        <button onClick={navigateToRoot} className="hover:text-white transition-colors">portfolio-media</button>
        {currentPath.map((folder, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            <button 
              onClick={() => handleNavigateUp(idx)}
              className="hover:text-white transition-colors"
            >
              {folder}
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <Folder className="h-16 w-16 mb-4 opacity-50" />
              <p>This folder is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((item) => {
                const isFolder = item.id === null;
                return (
                  <div 
                    key={item.name}
                    onClick={() => isFolder ? handleNavigate(item.name) : null}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 cursor-pointer transition-colors group"
                  >
                    <div className="h-16 w-16 flex items-center justify-center bg-zinc-900 group-hover:bg-zinc-800 rounded-xl mb-3 transition-colors">
                      {isFolder ? (
                        <Folder className="h-8 w-8 text-yellow-500" />
                      ) : (
                        getFileIcon(item.name)
                      )}
                    </div>
                    <p className="text-sm font-medium text-zinc-300 text-center truncate w-full group-hover:text-white">
                      {item.name}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
