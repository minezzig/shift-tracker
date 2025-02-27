  // create h/m from decimal
  export const hmFormat = (decimal: number) => {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${hours}h ${minutes}m`;
  };