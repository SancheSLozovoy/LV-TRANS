import React, { useState, useEffect } from "react";
import { List, Button, Spin, message } from "antd";
import { FileOutlined, DownloadOutlined } from "@ant-design/icons";
import useFetch from "../../composales/useFetch.ts";
import { useParams } from "react-router-dom";
import axios from "axios";

interface FileData {
  id: number;
  file_name: string;
  file_type: string;
}

export const OrderFiles: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { fetchData } = useFetch();
  const { id } = useParams();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetchData(`/orders/${id}/files`, "GET");
        setFiles(response);
      } catch (err) {
        console.error("Error fetching files list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [id]);

  if (loading) return <Spin size="large" />;

  const handleDownload = async (
    fileId: number,
    fileName: string,
    fileType: string,
  ) => {
    try {
      const response = await fetchData(`/orders/files/${fileId}`, "GET");

      if (!response?.file_base64) {
        throw new Error("Файл не найден или произошла ошибка");
      }

      const byteCharacters = atob(response.file_base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      // 4. Очистка
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download error:", error);
      alert("Ошибка при скачивании файла");
    }
  };

  // Использование:
  const downloadFile = (fileData) => {
    handleDownload(fileData.id, fileData.file_name, fileData.file_type);
  };

  return (
    <List
      dataSource={files}
      renderItem={(file) => (
        <List.Item style={{ display: "flex", width: "500px" }}>
          <List.Item.Meta
            avatar={<FileOutlined style={{ fontSize: 24 }} />}
            title={file.file_name}
          />
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => downloadFile(file)}
          >
            Скачать
          </Button>
        </List.Item>
      )}
      locale={{ emptyText: "Нет загруженных файлов" }}
    />
  );
};
