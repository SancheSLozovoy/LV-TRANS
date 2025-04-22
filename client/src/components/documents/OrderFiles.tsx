import React, { useState, useEffect } from "react";
import { List, Button, Spin } from "antd";
import { FileOutlined, DownloadOutlined } from "@ant-design/icons";
import useFetch from "../../composales/useFetch.ts";
import { useParams } from "react-router-dom";
import { FileData } from "../../models/file.ts";

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

  const handleDownload = async (file: FileData) => {
    try {
      const response = await fetchData(`/orders/files/${file.id}`, "GET");

      if (!response?.file_base64) {
        throw new Error("Файл не найден или произошла ошибка");
      }

      const byteCharacters = atob(response.file_base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.file_type });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download error:", error);
      alert("Ошибка при скачивании файла");
    }
  };

  return (
    <List
      dataSource={files}
      renderItem={(file) => (
        <List.Item>
          <List.Item.Meta
            avatar={<FileOutlined style={{ fontSize: 24 }} />}
            title={file.file_name}
          />
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(file)}
          >
            Скачать
          </Button>
        </List.Item>
      )}
      locale={{ emptyText: "Нет загруженных файлов" }}
    />
  );
};
