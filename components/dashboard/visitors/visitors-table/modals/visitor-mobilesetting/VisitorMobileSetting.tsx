import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CircleCheck, EllipsisVertical, PackageSearch, Settings, X } from 'lucide-react';
import Link from 'next/link';

type Props = {};

export default function VisitorMobileSetting({
  visitorName,
  visitorMob,
  visitorCode,
  setLink,
  anbLink,
  cusLink
}: any) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-xs p-0 bg-transparent hover:opacity-60 hover:bg-transparent border-none"
          >
            <EllipsisVertical />
          </Button>
        </DialogTrigger>
        <DialogContent
          // showClose={false}
          className="max-w-[95vw] p-3 rounded-xl sm:max-w-[600px] text-sm"
        >
          <DialogClose className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">بستن</span>
          </DialogClose>
          <DialogHeader
            dir="ltr"
            className=" flex flex-col items-end px-2 justify-start border-b pb-4"
          >
            <DialogTitle className="text-sm text-muted-foreground bg-background relative z-10 px-2 -mr-2">
              نام ویزیتور
            </DialogTitle>
            <div className="flex items-center gap-2">
              <p className="border gap-1 rounded-full px-1 py-1 shadow-innerhit text-green-600 flex items-center">
                فعال <CircleCheck className="w-6" />
              </p>
              <p>|</p>
              <DialogDescription className="text-base text-foreground">
                {visitorName}
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-start flex-col gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-1 text-muted-foreground">IMEI</h4>
                <p>{visitorCode} </p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-muted-foreground">شماره تلفن</h4>
                <p>{visitorMob} </p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-muted-foreground">عملیات</h4>
                <div className="flex items-center">
                  <Link href={setLink}>
                    <Button className="" variant="ghost" size="sm">
                      <Settings />
                      <p>تنظیمات ویزیتور</p>
                    </Button>
                  </Link>
                  <Link href={anbLink}>
                    <Button className="" variant="ghost" size="sm">
                      <PackageSearch />
                      <p>تنظیمات انبارک</p>
                    </Button>
                  </Link>
                  <Link href={cusLink}>
                    <Button variant="ghost" size="sm">
                      <PackageSearch />
                      <p>مشتریان حسابداری</p>
                    </Button>
                  </Link>
                  {/* <Button className="" variant="ghost" size="sm">
                    <LocateFixedIcon />
                    <p>تور ویزیتور</p>
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
