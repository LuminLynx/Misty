import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Moon } from '@phosphor-icons/react';

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export function WeatherIcon({ condition, size = 64, className = '' }: WeatherIconProps) {
  const iconProps = { size, weight: 'duotone' as const, className };
  
  switch (condition) {
    case '01d':
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sun {...iconProps} />
        </motion.div>
      );
    
    case '01n':
      return <Moon {...iconProps} />;
    
    case '02d':
    case '02n':
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      return (
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cloud {...iconProps} />
        </motion.div>
      );
    
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return (
        <motion.div
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudRain {...iconProps} />
        </motion.div>
      );
    
    case '11d':
    case '11n':
      return (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CloudLightning {...iconProps} />
        </motion.div>
      );
    
    case '13d':
    case '13n':
      return (
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudSnow {...iconProps} />
        </motion.div>
      );
    
    case '50d':
    case '50n':
      return (
        <motion.div
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <CloudFog {...iconProps} />
        </motion.div>
      );
    
    default:
      return <Cloud {...iconProps} />;
  }
}
