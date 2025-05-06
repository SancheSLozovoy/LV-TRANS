import { Tabs } from "antd";
import { OrderFiles } from "../documents/OrderFiles.tsx";
import { EditOrderForm } from "../forms/editOrder/EditOrder.tsx";
import "./orderTabs.scss";

export const OrderTabs = () => {
  return (
    <Tabs size="middle" className="custom-tabs">
      <Tabs.TabPane tab="Информация" key="1">
        <EditOrderForm />
      </Tabs.TabPane>

      <Tabs.TabPane tab="Документы" key="2">
        <OrderFiles />
      </Tabs.TabPane>
    </Tabs>
  );
};
