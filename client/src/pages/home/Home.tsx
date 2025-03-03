import { useEffect } from "react";
import { Layout } from "../../components/layout/Layout.tsx";
import ButtonSubmit from "../../components/button/Button.tsx";
import "./home.scss";
import { MainForm } from "../../components/forms/mainForm/MainForm.tsx";
import { AdvantagesBlock } from "../../components/advantagesBlock/AdvantagesBlock.tsx";
import { Container } from "../../components/container/Container.tsx";
import Company from "../../assets/images/compamy.jpeg";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const handleGoToATI = () => {
  window.location.href = "https://ati.su/firms/93638/info";
};

export const Home = () => {
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const currentScroll = window.scrollY;

      const distanceFromBottom =
        scrollHeight - (currentScroll + viewportHeight);

      const element = document.querySelector(".scroll") as HTMLElement;
      console.log(distanceFromBottom);

      if (element) {
        if (distanceFromBottom <= 10) {
          element.classList.add("visible");
        } else {
          element.classList.remove("visible");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
            <ButtonSubmit
              text="Больше о нас"
              onClick={() => scrollToSection("about")}
            />
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

      <section id="about" className="about">
        <Container>
          <div className="about__content">
            <div className="about__title">О нас</div>
            <div className="about__inner">
              <div className="about__company">
                <div className="company__name">
                  <h1>LV-TRANS</h1>
                </div>
                <div className="company__creator">
                  <p>ИП Лозовой Вадим Николаевич</p>
                </div>
                <div className="company__about">
                  Мы работаем на рынке грузоперевозок более 10 лет, сотрудничаем
                  с рядом известных компаний, представлены и активно работаем на
                  бирже АТИ. В условиях меняющегося рынка мы идем навстречу
                  клиенту и предлагаем качественную услугу по приемлемой цене!
                </div>
                <button
                  onClick={() => handleGoToATI()}
                  className="about__button"
                >
                  Профиль на АТИ
                </button>
              </div>
              <div className="about__image">
                <img src={Company} alt="company" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="contact" className="contact">
        <Container>
          <div className="contact__content">
            <div className="contact__inner">
              <div className="contact__company">
                <div className="contact__title">Связь с нами</div>

                <div className="contact__item mail">
                  <div className="item__title">
                    <p>Почта</p>
                  </div>
                  <div className="item__content">
                    <a href="mailto:info@lv-trans.ru">info@lv-trans.ru</a>
                  </div>
                </div>

                <div className="contact__item phone">
                  <div className="item__title">
                    <p>Телефон</p>
                  </div>
                  <div className="item__content">
                    <a href="tel:+79281346454">+7 (928) 134-64-54</a>
                  </div>
                </div>

                <div className="contact__item address">
                  <div className="item__title">
                    <p>Адрес</p>
                  </div>
                  <div className="item__content">
                    <p>г.Ростов-на-Дону ул.Геологическая 9 1 этаж офис 4</p>
                  </div>
                </div>
              </div>

              <div className="contact__map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2707.447637921135!2d39.769863976778126!3d47.26650341140047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40e3b771cb5fa5f7%3A0x1c59266e98a239a4!2z0JPQtdC-0LvQvtCz0LjRh9C10YHQutCw0Y8g0YPQuy4sIDksINCg0L7RgdGC0L7Qsi3QvdCwLdCU0L7QvdGDLCDQoNC-0YHRgtC-0LLRgdC60LDRjyDQvtCx0LsuLCDQoNC-0YHRgdC40Y8sIDM0NDA2NQ!5e0!3m2!1sru!2snl!4v1740916072499!5m2!1sru!2snl"
                  width="670"
                  height="370"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <div className="scroll" onClick={scrollToTop}></div>
    </Layout>
  );
};
