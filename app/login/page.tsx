import CustomerLoginForm from "../../components/CustomerLoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <CustomerLoginForm redirectTo={redirect ?? null} />;
}
