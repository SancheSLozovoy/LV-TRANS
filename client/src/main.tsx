import { createRoot } from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ConfigProvider locale={ruRU}>
      <App />
    </ConfigProvider>,
  );
} else {
  console.error("Root element not found");
}
