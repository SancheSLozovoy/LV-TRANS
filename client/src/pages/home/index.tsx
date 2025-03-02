import { Layout } from "../../components/layout";
import Button from "../../components/button/button.tsx";
import "./home.scss";
import { MainForm } from "../../components/forms/mainForm/mainForm.tsx";
import { AdvantagesBlock } from "../../components/advantagesBlock/advantagesBlock.tsx";
import { Container } from "../../components/container/container.tsx";

export const Home = () => {
  return (
    <Layout>
      <Container>
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
            <h1 className="prewiew__form-title">Сделать заказ</h1>
            <MainForm />
          </div>
        </section>
      </Container>

      <section id="advantages" className="advantages">
        <Container>
          <div className="advantages__content">
            <div className="advantages__title">
              <h1>Наши преимущества</h1>
            </div>
            <div className="advantages__blocks">
              <AdvantagesBlock
                text="Безупречная репутация
в сфере перевозок негабаритных и тяжеловесных грузов"
                smile="🥇"
                type="small"
              />
              <AdvantagesBlock
                text="Обеспечение безопасности груза
от погрузки до выгрузки в месте назначения"
                smile="🔐"
                type="medium"
              />
              <AdvantagesBlock
                text="Собственный парк
надежной автомобильной техники специального назначения"
                smile="🚚"
                type="big"
              />
              <AdvantagesBlock
                text="Узкая специализация
перевозка негабаритного и тяжеловесного груза"
                smile="🔛"
                type="big"
              />
              <AdvantagesBlock
                text="Высокопрофессиональные водители
с большим стажем работы"
                smile="👷‍♂️"
                type="medium"
              />
              <AdvantagesBlock
                text="Гибкая политика
ценообразования"
                smile="💵"
                type="small"
              />
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};
