import React from 'react';

interface SeoArticleProps {
  title: string;
  children: React.ReactNode;
}

export default function SeoArticle({ title, children }: SeoArticleProps) {
  return (
    <article className="max-w-4xl mx-auto mt-12 mb-8 px-6 py-8 bg-white rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6 tracking-tight border-b border-slate-100 pb-4">
        {title}
      </h2>
      <div className="space-y-5 text-slate-600 leading-relaxed text-base sm:text-lg">
        {children}
      </div>
    </article>
  );
}
