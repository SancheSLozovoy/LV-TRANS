import React from "react";
import { Space, Table } from "antd";

const { Column } = Table;

interface DataType {
  key: React.Key;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  tags: string[];
}

const data: DataType[] = [];

export const UserTable = () => {
  return (
    <Table<DataType> dataSource={data}>
      <Column title="Номер заказа" dataIndex="id" key="id" />
      <Column title="Статус" dataIndex="status" key="status" />
      <Column title="Дата создания" dataIndex="create_date" key="create_date" />
      <Column
        title=""
        key="action"
        render={(_: any, record: DataType) => (
          <Space size="middle">
            <a>Invite {record.lastName}</a>
            <a>Delete</a>
          </Space>
        )}
      />
    </Table>
  );
};
