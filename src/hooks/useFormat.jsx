const useFormat = (seconds) => {
    
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemaining = Math.floor(seconds % 60);

  return `${hours === 0 ? "" : hours.toString() + ":"}${minutes.toString().padStart(2, "0")}:${secondsRemaining.toString().padStart(2, "0")}`;
};

export default useFormat;
