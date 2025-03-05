import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/animation2.json";
import { Layout } from "../../components/layout/Layout.tsx";
import ButtonSubmit from "../../components/button/Button.tsx";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
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
        <div style={{ width: "344px", marginTop: "50px" }}>
          <ButtonSubmit onClick={returnToMain} text="Вернуться на главную" />
        </div>
      </div>
    </Layout>
  );
};
