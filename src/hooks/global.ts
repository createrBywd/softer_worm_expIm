import { Animated } from 'react-native'

type UseAnimated<T> = (config: {
  type: T
  ref: any
  toValue: number
  useNativeDriver: Boolean
  ease: unknown
  duration: number | bigint
}) => any

export const useAnimated: UseAnimated<string> = (
  config
) => {
  const { type, ref } = config
  const animated = Animated[type](ref, {
    ...config,
    type: undefined,
    ref: undefined,
  })
  return animated
}
