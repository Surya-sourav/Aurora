'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, GripVertical } from 'lucide-react';
import { ImageDropzone } from './ImageDropzone';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import type { PersonalImage } from '@/lib/types';

export function GalleryManager({ initial }: { initial: PersonalImage[] }) {
  const [images, setImages] = useState<PersonalImage[]>(initial);

  const remove = async (id: string) => {
    if (!confirm('delete this image?')) return;
    const res = await fetch(`/api/admin/proxy/personal/images/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setImages((xs) => xs.filter((x) => x.id !== id));
      toast.success('image removed');
    } else {
      toast.error('failed to delete');
    }
  };

  const updateAlt = async (id: string, alt_text: string) => {
    const res = await fetch(`/api/admin/proxy/personal/images/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt_text }),
    });
    if (res.ok) {
      setImages((xs) =>
        xs.map((x) => (x.id === id ? { ...x, alt_text } : x)),
      );
    }
  };

  const reorder = async (id: string, direction: -1 | 1) => {
    const idx = images.findIndex((x) => x.id === id);
    const target = idx + direction;
    if (idx < 0 || target < 0 || target >= images.length) return;
    const newImages = [...images];
    [newImages[idx], newImages[target]] = [newImages[target], newImages[idx]];
    setImages(newImages);
    await Promise.all(
      newImages.map((img, i) =>
        fetch(`/api/admin/proxy/personal/images/${img.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: i }),
        }),
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="flex items-center gap-3 border border-[--color-border] rounded-md p-2"
          >
            <div className="flex flex-col">
              <button
                onClick={() => reorder(img.id, -1)}
                disabled={i === 0}
                className="text-[--color-faint] hover:text-[--color-accent] disabled:opacity-30 p-0.5"
                aria-label="Move up"
              >
                <GripVertical size={12} />↑
              </button>
              <button
                onClick={() => reorder(img.id, 1)}
                disabled={i === images.length - 1}
                className="text-[--color-faint] hover:text-[--color-accent] disabled:opacity-30 p-0.5"
                aria-label="Move down"
              >
                <GripVertical size={12} />↓
              </button>
            </div>
            <div className="relative w-16 h-16 shrink-0 border border-[--color-border] rounded overflow-hidden">
              <Image
                src={`/api/img/personal/images/${img.id}`}
                alt={img.alt_text || ''}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <Input
              defaultValue={img.alt_text}
              placeholder="alt text"
              onBlur={(e) => updateAlt(img.id, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => remove(img.id)}
              aria-label="Delete"
            >
              <X size={12} />
            </Button>
          </div>
        ))}
      </div>
      <ImageDropzone
        endpoint="/api/admin/proxy/personal/images"
        label="add another photo to the gallery"
        onUploaded={(img) =>
          setImages((xs) => [
            ...xs,
            { id: img.id, alt_text: img.alt_text ?? '', sort_order: xs.length },
          ])
        }
      />
    </div>
  );
}
