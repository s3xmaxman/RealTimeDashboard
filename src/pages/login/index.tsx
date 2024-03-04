import { AuthPage } from "@refinedev/antd";
import { authCredentials } from "../../provider/auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
