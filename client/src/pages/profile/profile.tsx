import { useAuth } from "../../composales/useAuth.ts";

import { getUserInfo } from "../../api/user/getUserInfo";
import { useState } from "react";

export const Profile = () => {
  const { handleGetUser } = useAuth();

  const [userInfo, serUserInfo] = useState({});

  if (token) {
    const user = handleGetUser(token);
    console.log(user);
    serUserInfo(getUserInfo(user.id));
  }

  return (
    <div>
      Profile
      <div>{userInfo}</div>
    </div>
  );
};
