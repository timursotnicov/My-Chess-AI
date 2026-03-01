import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import DragonSprite from './DragonSprite';
import DragonEmotions from './DragonEmotions';
import {
  AnimationState,
  ACTION_TO_ANIMATION,
  MOOD_TO_ANIMATION,
  ANIMATION_DURATIONS,
} from './DragonAnimations';
import { DragonMood, ActionId } from '../../types';

interface DragonProps {
  mood: DragonMood;
  currentAction: ActionId | null;
  onActionAnimationEnd?: () => void;
  size?: number;
}

const Dragon: React.FC<DragonProps> = ({
  mood,
  currentAction,
  onActionAnimationEnd,
  size = 200,
}) => {
  const [animation, setAnimation] = useState<AnimationState>('idle');

  const getBaseAnimation = useCallback((): AnimationState => {
    return MOOD_TO_ANIMATION[mood] ?? 'idle';
  }, [mood]);

  useEffect(() => {
    if (currentAction) {
      const anim = ACTION_TO_ANIMATION[currentAction] ?? 'idle';
      setAnimation(anim);

      const duration = ANIMATION_DURATIONS[anim];
      if (duration > 0) {
        const timer = setTimeout(() => {
          setAnimation(getBaseAnimation());
          onActionAnimationEnd?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setAnimation(getBaseAnimation());
    }
  }, [currentAction, getBaseAnimation, onActionAnimationEnd]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <DragonEmotions mood={mood} size={size} />
      <DragonSprite
        animation={animation}
        size={size}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Dragon;
