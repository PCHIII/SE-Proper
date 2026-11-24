import { useState } from 'react'

type AvatarProps = {
  portrait?: string
  size?: 'tiny' | 'small' | 'medium' | 'me'
  label?: string
}

export default function Avatar({ portrait, size = 'tiny', label }: AvatarProps) {
  const [failedPortrait, setFailedPortrait] = useState<string>()

  return (
    <span className={`avatar avatar-${size}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} title={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
      </svg>
      {portrait && portrait !== failedPortrait && <img src={portrait} alt="" onError={() => setFailedPortrait(portrait)} />}
    </span>
  )
}
