import { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
}

export default function ImageUpload({ value, onChange, label, bucket = 'media' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onChange(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>}
      <div 
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 
          ${value ? 'border-cyan-500/30 bg-black/40' : 'border-gray-700 bg-black/20 hover:border-cyan-400 hover:bg-cyan-950/20'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/jpg, image/webp" 
          className="hidden" 
        />
        
        {value ? (
          <div className="relative group flex items-center justify-center p-2 min-h-[120px]">
            <img src={value} alt="Preview" className="max-h-48 object-contain rounded-lg" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                disabled={uploading}
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center py-8 px-4 gap-3 cursor-pointer"
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-gray-500" />
            )}
            <div className="text-center">
              <p className="text-sm text-gray-300 font-medium">
                {uploading ? 'Uploading...' : 'Click or drag image to upload'}
              </p>
              {!uploading && <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</p>}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
