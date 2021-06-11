export const formatPlayTime = (timeInSeconds?: number) => {
  if (timeInSeconds) {
    const minutes = Math.floor(Math.ceil(timeInSeconds) / 60);
    const seconds = Math.ceil(timeInSeconds) % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  }
  return '00:00';
};
