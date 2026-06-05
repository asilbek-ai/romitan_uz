import React, { useState } from 'react';

export default function RichTextEditor({ content, onChange }) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      rows={8}
      className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary"
      placeholder="Matnni kiriting..."
    />
  );
}