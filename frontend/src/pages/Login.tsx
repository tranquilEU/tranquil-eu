import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostApiAuthLogin } from "../api/client";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

const Login = () => {
  const { t } = useTranslation("translation");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending, isError } = usePostApiAuthLogin({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("accessToken", data.accessToken ?? "");
        localStorage.setItem("refreshToken", data.refreshToken ?? "");
        navigate("/dashboard");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        alert(error.response?.data?.message || "Login failed");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ data: { email, password } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{t("login.title")}</h2>
        <LanguageSwitcher />
        <input
          type="email"
          placeholder={t("login.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("login.passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? t("login.loggingIn") : t("login.loginButton")}
        </button>
        {isError && <p>{t("login.loginFailed")}</p>}
      </form>
    </div>
  );
};

export default Login;
