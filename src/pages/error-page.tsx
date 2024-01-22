import { Button } from "@/components/ui/button";
import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as { statusText: string, message: string };

  return (
    <div id="error-page" className="grid h-screen place-content-center justify-items-center gap-2">
      <h1 className="text-2xl font-semibold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <br />
      <Link to='/'>
        <Button variant='outline' className="p-6 text-lg">Back</Button>
      </Link>
    </div>
  );
}