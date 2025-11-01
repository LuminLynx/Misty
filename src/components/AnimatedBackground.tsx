import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

interface AnimatedBackgroundProps {
  weatherCondition?: string;
}

const weatherBackgrounds = {
  Clear: {
    gradient: 'from-cyan-400/20 via-blue-400/15 to-yellow-400/20',
    orbs: [
      { color: 'bg-yellow-400/25', size: 'w-[600px] h-[600px]' },
      { color: 'bg-cyan-400/20', size: 'w-[500px] h-[500px]' },
      { color: 'bg-blue-300/15', size: 'w-[450px] h-[450px]' },
    ]
  },
  Clouds: {
    gradient: 'from-gray-300/20 via-slate-300/15 to-blue-300/20',
    orbs: [
      { color: 'bg-gray-400/20', size: 'w-[600px] h-[600px]' },
      { color: 'bg-slate-300/15', size: 'w-[500px] h-[500px]' },
      { color: 'bg-blue-200/15', size: 'w-[450px] h-[450px]' },
    ]
  },
  Rain: {
    gradient: 'from-slate-500/20 via-blue-600/15 to-cyan-600/20',
    orbs: [
      { color: 'bg-blue-600/20', size: 'w-[600px] h-[600px]' },
      { color: 'bg-slate-500/15', size: 'w-[500px] h-[500px]' },
      { color: 'bg-cyan-500/15', size: 'w-[450px] h-[450px]' },
    ]
  },
  Drizzle: {
    gradient: 'from-slate-400/20 via-cyan-500/15 to-blue-500/20',
    orbs: [
      { color: 'bg-cyan-500/20', size: 'w-[600px] h-[600px]' },
      { color: 'bg-slate-400/15', size: 'w-[500px] h-[500px]' },
      { color: 'bg-blue-400/15', size: 'w-[450px] h-[450px]' },
    ]
  },
  Thunderstorm: {
    gradient: 'from-purple-900/25 via-slate-700/20 to-yellow-600/20',
    orbs: [
      { color: 'bg-purple-900/25', size: 'w-[600px] h-[600px]' },
      { color: 'bg-slate-700/20', size: 'w-[500px] h-[500px]' },
      { color: 'bg-yellow-600/15', size: 'w-[450px] h-[450px]' },
    ]
  },
  Snow: {
    gradient: 'from-blue-100/30 via-cyan-100/20 to-white/25',
    orbs: [
      { color: 'bg-blue-100/30', size: 'w-[600px] h-[600px]' },
      { color: 'bg-cyan-100/25', size: 'w-[500px] h-[500px]' },
      { color: 'bg-white/20', size: 'w-[450px] h-[450px]' },
    ]
  },
  Mist: {
    gradient: 'from-gray-300/25 via-slate-200/20 to-blue-200/20',
    orbs: [
      { color: 'bg-gray-300/25', size: 'w-[600px] h-[600px]' },
      { color: 'bg-slate-200/20', size: 'w-[500px] h-[500px]' },
      { color: 'bg-blue-200/15', size: 'w-[450px] h-[450px]' },
    ]
  },
  Fog: {
    gradient: 'from-gray-400/25 via-slate-300/20 to-blue-300/20',
    orbs: [
      { color: 'bg-gray-400/25', size: 'w-[600px] h-[600px]' },
      { color: 'bg-slate-300/20', size: 'w-[500px] h-[500px]' },
      { color: 'bg-blue-300/15', size: 'w-[450px] h-[450px]' },
    ]
  },
  default: {
    gradient: 'from-cyan-500/20 via-blue-500/15 to-purple-500/20',
    orbs: [
      { color: 'bg-cyan-500/20', size: 'w-[600px] h-[600px]' },
      { color: 'bg-blue-500/15', size: 'w-[500px] h-[500px]' },
      { color: 'bg-purple-400/15', size: 'w-[450px] h-[450px]' },
    ]
  }
};

export function AnimatedBackground({ weatherCondition }: AnimatedBackgroundProps) {
  const background = useMemo(() => {
    const condition = weatherCondition as keyof typeof weatherBackgrounds;
    return weatherBackgrounds[condition] || weatherBackgrounds.default;
  }, [weatherCondition]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={weatherCondition || 'default'}
          className={`absolute inset-0 bg-gradient-to-br ${background.gradient} opacity-60`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <motion.div
        className={`absolute top-0 left-1/4 ${background.orbs[0].size} ${background.orbs[0].color} rounded-full blur-3xl`}
        animate={{
          x: [0, 100, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute bottom-0 right-1/4 ${background.orbs[1].size} ${background.orbs[1].color} rounded-full blur-3xl`}
        animate={{
          x: [0, -100, 0],
          y: [0, -80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${background.orbs[2].size} ${background.orbs[2].color} rounded-full blur-3xl`}
        animate={{
          x: [-100, 100, -100],
          y: [-80, 80, -80],
          scale: [1, 1.25, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute top-1/4 right-1/3 w-[400px] h-[400px] ${background.orbs[0].color} rounded-full blur-2xl`}
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      <motion.div
        className={`absolute bottom-1/4 left-1/3 w-[400px] h-[400px] ${background.orbs[1].color} rounded-full blur-2xl`}
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </div>
  );
}
