import { Layout } from "../../components/layout";
import Button from "../../components/button/button.tsx";
import { CalculatorOutlined } from "@ant-design/icons";
import "./home.scss";

export const Home = () => {
  return (
    <Layout>
      <section id="main" className="preview">
        <div className="preview__company">
          <h1 className="preview__title">LV-TRANS</h1>
          <p className="preview__text">
            Компания по перевозке негабаритных грузов по России, территории
            ближнего зарубежья и Европы!
          </p>
          <Button text="Больше о нас" />
        </div>
        <div className="prewiew__form">
          <h1>Сделать заказ</h1>
          <Button text="Рассчитать" icon={<CalculatorOutlined />} />
        </div>
      </section>
    </Layout>
  );
};
