import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function ShimmerButton({ children, className = '', ...props }: ShimmerButtonProps) {
  return (
    <button
      className={`group relative px-8 py-4 text-base font-medium font-inter text-white bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] cursor-pointer ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out">
          <div className="h-full w-8 rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm"></div>
        </div>
      </div>
    </button>
  );
}
