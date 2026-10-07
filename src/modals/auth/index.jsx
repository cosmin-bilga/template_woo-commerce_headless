import AuthForm from "../../components/AuthForm";
import ResetPasswordForm from "../../components/ResetPasswordForm/";

export default function AuthModalContent({ view, ...props }) {
  return view === "reset-password" ? (
    <ResetPasswordForm {...props} />
  ) : (
    <AuthForm view={view} {...props} />
  );
}
