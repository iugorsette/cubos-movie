import React, { useState, useEffect } from 'react'
import './index.css'
import { useTheme } from '../../hooks/useTheme'

interface BackgroundWithGradientProps {
  imageUrl: string
  children: React.ReactNode
}

const BackgroundWithGradient: React.FC<BackgroundWithGradientProps> = ({
  imageUrl,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const { isDark } = useTheme()

  useEffect(() => {
    const img = new Image()
    img.src = imageUrl
    img.onload = () => setIsLoading(false)

    const timeout = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timeout)
  }, [imageUrl])

  return (
    <div
      className={`background-container ${isDark ? 'dark-mode' : 'light-mode'}`}>
      <div
        className='background-loading'
        style={{ opacity: isLoading ? 1 : 0 }}></div>

      <div
        className='background-image'
        style={{
          opacity: isLoading ? 0 : 0.25,
          backgroundImage: `url(${imageUrl})`,
        }}></div>

      <div className='background-gradient'></div>
      <div className='background-content'>{children}</div>
    </div>
  )
}

export default BackgroundWithGradient
