import { AuthGuard } from "./authGuard";

export const withAuthGuard = (Component) => (props) =>
  (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  );
