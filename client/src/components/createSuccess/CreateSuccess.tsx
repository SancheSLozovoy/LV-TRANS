import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import animationData from "../../assets/lottie/animation1.json";
import { Type } from "../../models/orderModels";
import styles from "./createSuccess.module.scss";

interface CreateSuccessProps {
  type: Type;
}

export const CreateSuccess = ({ type }: CreateSuccessProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/profile");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const successText =
    type === Type.create
      ? "Заказ создан, мы свяжемся с вами в ближайшее время"
      : "Заказ обновлён, изменения успешно сохранены";

  return (
    <div className={styles.container}>
      <div className={styles.lottie}>
        <Lottie options={defaultOptions} isClickToPauseDisabled={true} />
      </div>

      <div className={styles.tab}>
        <h2>{successText}</h2>
        <p>Возврат на страницу профиля через: {countdown}</p>
      </div>
    </div>
  );
};
