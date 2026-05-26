import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-slate-400 mb-8 max-w-md">
        This is a placeholder page for the API and platform documentation.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}
