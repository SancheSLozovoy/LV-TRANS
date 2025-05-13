export const getFileIconColor = (fileType: string) => {
  if (fileType.includes("image")) return "#ff4d4f";
  if (fileType.includes("pdf")) return "#f5222d";
  if (fileType.includes("word")) return "#1890ff";
  if (fileType.includes("spreadsheetml") || fileType.includes("ms-excel"))
    return "#52c41a";
  return "#595959";
};
