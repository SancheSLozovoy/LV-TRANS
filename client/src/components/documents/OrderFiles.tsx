import React, { useState, useEffect } from "react";
import { List, Button, Spin, Upload, message } from "antd";
import {
  FileOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import useFetch from "../../composables/useFetch.ts";
import { useParams } from "react-router-dom";
import { FileData } from "../../models/file.ts";
import { useAuth } from "../../composables/useAuth.ts";
import ButtonSubmit from "../button/Button.tsx";
import { getFileIconColor } from "../../composables/getFileIconColor.ts";
import styles from "./orderFiles.module.scss";
import { ConfirmModal } from "../confirmModal/ConfirmModal.tsx";

const MAX_TOTAL_SIZE_MB = 5;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;
const MAX_FILE_COUNT = 5;

export const OrderFiles: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null,
  );

  const { fetchData } = useFetch();
  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    fetchFiles();
  }, [id, token]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetchData(`/orders/${id}/files`, "GET");
      if (Array.isArray(response)) {
        setFiles(response);
      } else {
        console.error("Ответ не является массивом", response);
      }
    } catch (err) {
      console.error("Error fetching files list:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSize = (files: FileData[]) => {
    return files.reduce((sum, file) => sum + Number(file.size || 0), 0);
  };

  const handleDownload = async (file: FileData) => {
    try {
      setDownloadingFileId(file.id);
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
      messageApi.error((error as Error).message);
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleUpload = async (options: any) => {
    const { file } = options;
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await fetchData(`/orders/${id}/files`, "POST", formData, {
        "Content-Type": "multipart/form-data",
      });
      messageApi.success(`${file.name} успешно загружен`);
      await fetchFiles();
    } catch (error) {
      console.error("Upload error:", error);
      messageApi.error((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx",
    multiple: false,
    showUploadList: false,
    customRequest: handleUpload,
    beforeUpload: (file: File) => {
      const currentTotalSize = calculateTotalSize(files);
      const newTotalSize = currentTotalSize + file.size;

      if (newTotalSize > MAX_TOTAL_SIZE_BYTES) {
        messageApi.error(
          `Общий размер файлов не должен превышать ${MAX_TOTAL_SIZE_MB}MB!`,
        );
        return Upload.LIST_IGNORE;
      }

      if (files.length >= MAX_FILE_COUNT) {
        messageApi.error(`Можно загрузить не более ${MAX_FILE_COUNT} файлов.`);
        return Upload.LIST_IGNORE;
      }

      return true;
    },
  };

  const showDeleteConfirm = (file: FileData) => {
    setFileToDelete(file);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      const res = await fetchData(`/orders/files/${fileToDelete.id}`, "DELETE");
      messageApi.success(res.message);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
    } catch (err) {
      console.error("Delete error:", err);
      messageApi.error((err as Error).message);
    } finally {
      setDeleteModalVisible(false);
      setFileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setFileToDelete(null);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.wrapper}>
        <h1>Файлы заказа</h1>
        <div className={styles.uploadContainer}>
          <Upload {...uploadProps}>
            <div className={styles.uploadButton}>
              <ButtonSubmit
                icon={<UploadOutlined />}
                loading={uploading}
                text="Загрузить файл"
              />
            </div>
          </Upload>
          <div className={styles.filesText}>
            Файлов: {files.length}/{MAX_FILE_COUNT} | Общий размер:{" "}
            {(calculateTotalSize(files) / (1024 * 1024)).toFixed(2)}MB/
            {MAX_TOTAL_SIZE_MB}MB
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          dataSource={files}
          renderItem={(file) => (
            <List.Item
              className={styles.listItem}
              actions={[
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(file)}
                  className={styles.downloadButton}
                  loading={downloadingFileId === file.id}
                >
                  Скачать
                </Button>,
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    showDeleteConfirm(file);
                  }}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <FileOutlined
                    className={styles.fileIcon}
                    style={{ color: getFileIconColor(file.file_type) }}
                  />
                }
                title={
                  <span className={styles.fileName}>{file.file_name}</span>
                }
                description={`${(Number(file.size) / (1024 * 1024)).toFixed(2)} MB`}
              />
            </List.Item>
          )}
          locale={{ emptyText: "Нет загруженных файлов" }}
        />
      )}

      <ConfirmModal
        open={deleteModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Удаление файла"
        description={`Вы уверены, что хотите удалить файл "${fileToDelete?.file_name}"?`}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </>
  );
};
