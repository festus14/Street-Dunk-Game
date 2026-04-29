import { Dimensions, Platform } from 'react-native';

const TARGET_ASPECT = 19.5 / 9;

if (Platform.OS === 'web') {
  const originalGet = Dimensions.get.bind(Dimensions);
  Dimensions.get = (dim) => {
    const real = originalGet(dim);
    if (dim !== 'window' && dim !== 'screen') return real;

    const aspect = real.width / real.height;
    let width = real.width;
    let height = real.height;
    if (aspect > TARGET_ASPECT) {
      width = real.height * TARGET_ASPECT;
    } else {
      height = real.width / TARGET_ASPECT;
    }
    return { ...real, width, height };
  };
}

export const WEB_TARGET_ASPECT = TARGET_ASPECT;
