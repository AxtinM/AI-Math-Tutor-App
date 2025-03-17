import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-4xl font-bold">أنت غير متصل بالإنترنت</h1>
      <h2 className="text-xl">You are offline</h2>
      <p className="mb-4 max-w-md text-muted-foreground">
        يبدو أنك غير متصل بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.
      </p>
      <p className="mb-8 max-w-md text-muted-foreground">
        It seems you are not connected to the internet. Please check your connection and try again.
      </p>
      <Button asChild>
        <Link href="/">
          العودة إلى الصفحة الرئيسية
          <br />
          Return to Home
        </Link>
      </Button>
    </div>
  );
}
