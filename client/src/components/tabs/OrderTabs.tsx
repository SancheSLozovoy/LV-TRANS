import { Tabs } from "antd";
import { OrderFiles } from "../documents/OrderFiles.tsx";
import React from "react";
import { EditOrderForm } from "../forms/editOrder/EditOrder.tsx";

export const OrderTabs = () => {
  return (
    <Tabs size="middle" defaultActiveKey="1">
      <Tabs.TabPane tab="Информация" key="1">
        <EditOrderForm />
      </Tabs.TabPane>

      <Tabs.TabPane tab="Документы" key="2">
        <OrderFiles />
      </Tabs.TabPane>
    </Tabs>
  );
};
