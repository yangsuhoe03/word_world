import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const guidelineBaseWidth = 530; // 기준 디바이스 (예: iPhone X)

const scale = SCREEN_WIDTH / guidelineBaseWidth;

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}