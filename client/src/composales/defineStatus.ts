interface Status {
  id: number;
  name: string;
  color: string;
}

export const defineStatus = (id: number): Status => {
  switch (id) {
    case 1:
      return { id, name: "Не принят", color: "#D32F2F" };
    case 2:
      return { id, name: "Принят", color: "#1976D2" };
    case 3:
      return { id, name: "В пути", color: "#FBC02D" };
    case 4:
      return { id, name: "Доставлен", color: "#388E3C" };
    default:
      return { id, name: "Не принят", color: "#D32F2F" };
  }
};
