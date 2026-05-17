'use client';
import { useCallback, useState, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';

export interface UploadedImage {
  id: string;
  alt_text: string;
  mime_type?: string;
}

interface Props {
  endpoint: '/api/admin/proxy/images' | '/api/admin/proxy/personal/images';
  onUploaded: (image: UploadedImage) => void;
  label?: string;
  extraField?: { name: string; value: string };
}

export function ImageDropzone({ endpoint, onUploaded, label, extraField }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      if (extraField) fd.append(extraField.name, extraField.value);
      setUploading(true);
      try {
        const res = await fetch(endpoint, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`upload failed (${res.status})`);
        const data = (await res.json()) as { success: boolean; image: UploadedImage };
        toast.success('image uploaded');
        onUploaded(data.image);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'upload failed');
      } finally {
        setUploading(false);
      }
    },
    [endpoint, extraField, onUploaded],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-md p-6 transition-colors ${
        dragging
          ? 'border-[--color-accent] bg-[--color-bg-elev]'
          : 'border-[--color-border] hover:border-[--color-muted]'
      }`}
    >
      <label className="flex flex-col items-center gap-2 cursor-pointer text-center">
        {uploading ? (
          <Spinner size={20} />
        ) : (
          <Upload size={20} className="text-[--color-muted]" />
        )}
        <span className="font-mono text-xs text-[--color-muted]">
          {label ?? 'drop image or click to upload'}
        </span>
        <span className="font-mono text-[10px] text-[--color-faint]">
          png · jpeg · webp · gif · max 5mb
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  );
}
