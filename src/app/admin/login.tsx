import { Redirect } from 'expo-router';

/** Same credentials as user login; this route only exists so /admin/login deep links go to the shared screen. */
export default function AdminLoginRedirect() {
  return <Redirect href="/(auth)/login" />;
}
