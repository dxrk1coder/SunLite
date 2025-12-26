import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error: any) {
    console.error("React Rendering Error:", error);
    container.innerHTML = `<div style="padding: 40px; color: #ef4444; font-family: sans-serif; text-align: center; background: #020617; min-height: 100vh;">
      <h2 style="font-size: 24px; margin-bottom: 16px;">Tizimni yuklashda xatolik yuz berdi</h2>
      <p style="color: #94a3b8; margin-bottom: 24px;">Iltimos, sahifani yangilang yoki brauzer keshini tozalang.</p>
      <pre style="background: #0f172a; padding: 20px; border-radius: 12px; display: inline-block; text-align: left; max-width: 100%; overflow: auto; color: #f8fafc; border: 1px solid #1e293b;">${error?.message || error}</pre>
    </div>`;
  }
} else {
  console.error("Root element (#root) topilmadi!");
}