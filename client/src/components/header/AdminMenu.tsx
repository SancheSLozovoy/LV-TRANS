import React from "react";
import { Link } from "react-router-dom";
import styles from "./adminMenu.module.scss";
import {
  UnorderedListOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

export const AdminMenu = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <nav>
          <ul className={styles.header__nav_list}>
            <Tooltip placement="right" title="Список заказов">
              <Link to="/admin/orders">
                <li>
                  <UnorderedListOutlined />
                </li>
              </Link>
            </Tooltip>

            <Tooltip placement="right" title="Список пользователей">
              <Link to="/admin/users">
                <li>
                  <TeamOutlined />
                </li>
              </Link>
            </Tooltip>
          </ul>
        </nav>
        <div>
          <Tooltip placement="right" title="Профиль">
            <Link to="/admin/profile">
              <UserOutlined />
            </Link>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
