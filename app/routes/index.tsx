import { DataFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export async function loader({ request }: DataFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/timer',
  });

  return redirect('/auth/sign-in');
}


export default function Index() {
  return (
    <>

    </>
  );
}
