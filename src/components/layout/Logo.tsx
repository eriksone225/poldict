
import { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      <circle cx="50" cy="50" r="48" fill="currentColor" stroke="none" />
      
      {/* Gears */}
      <g fill="#2C3E50">
        {/* Left Gear */}
        <path d="M35,60 a10,10 0 1,0 0,-0.001 z M35,58 a8,8 0 1,1 0,0.001" />
        <path d="M35,63 l-1,3 h2 z M35,47 l-1,-3 h2 z M27,58 l-3,1 v-2 z M43,58 l3,1 v-2 z M30,62 l-2,2 -1,-2 z M40,62 l2,2 1,-2 z M30,50 l-2,-2 -1,2 z M40,50 l2,-2 1,2 z" />
        
        {/* Right Gear */}
        <path d="M55,60 a10,10 0 1,0 0,-0.001 z M55,58 a8,8 0 1,1 0,0.001" />
        <path d="M55,63 l-1,3 h2 z M55,47 l-1,-3 h2 z M47,58 l-3,1 v-2 z M63,58 l3,1 v-2 z M50,62 l-2,2 -1,-2 z M60,62 l2,2 1,-2 z M50,50 l-2,-2 -1,2 z M60,50 l2,-2 1,2 z" />
      </g>
      
      {/* Abstract PD shape */}
      <g fill="#9CA3AF">
        <path d="M35 55 l5 -5 l5 5 l-2.5 5 l-5 0 z" fill="#9CA3AF" />
        <path d="M42 58 q-5 12 5 12 q2 0 3 -2 l-3 -10 z" fill="#2C3E50" />
      </g>

      {/* Triangles */}
      <g fill="#9CA3AF">
        <path d="M45,45 l5,-5 l5,5 z" />
        <path d="M45,40 l5,-5 l5,5 z" />
      </g>

      {/* Checkmark */}
      <path d="M48,30 l-5,5 l10,-10" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" fill="none" transform="translate(2, 2)"/>
      
      {/* Text */}
      <text x="50" y="85" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2C3E50">
        POLDICT
      </text>
    </svg>
  );
}
