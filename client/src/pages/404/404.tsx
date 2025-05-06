import Lottie from "react-lottie";
import animationData from "../../assets/lottie/animation2.json";
import { Layout } from "../../components/layout/Layout.tsx";
import ButtonSubmit from "../../components/button/Button.tsx";
import { useNavigate } from "react-router-dom";
import styles from "./404.module.scss";

export const NotFoundPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const navigate = useNavigate();

  const returnToMain = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.lottie}>
          <Lottie options={defaultOptions} isClickToPauseDisabled={true} />
        </div>

        <div className={styles.buttonWrapper}>
          <ButtonSubmit onClick={returnToMain} text="Вернуться на главную" />
        </div>
      </div>
    </Layout>
  );
};
