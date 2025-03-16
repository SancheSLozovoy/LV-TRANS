import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import animationData from "../../assets/lottie/animation1.json";
import "./createSuccess.scss";

export const CreateSuccess = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Lottie
        options={defaultOptions}
        height={500}
        width={500}
        isClickToPauseDisabled={true}
      />
      <div className="tab">
        <h2>Заказ создан, мы свяжемся с вами в ближайшее время</h2>
        <p>Возврат на страницу профиля через: {countdown}</p>
      </div>
    </div>
  );
};
