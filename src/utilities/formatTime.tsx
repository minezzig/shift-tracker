export const formatTime = (time: String) => {
    return new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(time))
}