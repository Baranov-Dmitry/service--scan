export const adaptiveSize = (style: string, pcSize: number, mobSize: number, maxWidth: number = 1440, minWidth: number = 375) => {

  const addSize = pcSize - mobSize
  const addMobSize = addSize + addSize * 0.7;

  return `
    @media (max-width: 767px) {
      ${style}: calc(${mobSize}px + ${addMobSize} * ((100vw - ${minWidth}px) / ${maxWidth}));
    }

    @media (min-width: 767px) {
      ${style}: calc(${mobSize}px + ${addSize} * (100vw / ${maxWidth}));
    }
  `
}