import { useId } from 'react'

const Logo = ({ className = "h-8 w-8", showText = false }) => {
  const gradientId = useId()
  
  if (showText) {
    return (
      <svg 
        className={className}
        viewBox="0 0 280 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#059669', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#047857', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        
        <text x="5" y="42" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="700" fill={`url(#${gradientId})`}>
          Your
        </text>
        
        <g transform="translate(85, 8)">
          <circle cx="20" cy="20" r="18" fill={`url(#${gradientId})`} opacity="0.15"/>
          <path 
            d="M 12 20 L 18 26 L 28 14" 
            stroke={`url(#${gradientId})`}
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />
        </g>
        
        <text x="130" y="42" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="700" fill={`url(#${gradientId})`}>
          ark
        </text>
        
        <text x="195" y="42" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="400" fill="#6b7280">
          .ai
        </text>
      </svg>
    )
  }
  
  return (
    <svg 
      className={className}
      viewBox="0 0 60 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#059669', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#047857', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      <circle cx="30" cy="30" r="28" fill={`url(#${gradientId})`} opacity="0.15"/>
      
      <path 
        d="M 15 30 L 25 40 L 45 18" 
        stroke={`url(#${gradientId})`}
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      
      <circle cx="25" cy="40" r="2.5" fill="#10b981"/>
      <circle cx="45" cy="18" r="2.5" fill="#10b981"/>
    </svg>
  )
}

export default Logo
