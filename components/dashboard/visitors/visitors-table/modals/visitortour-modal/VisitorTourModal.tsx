import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocateFixedIcon } from 'lucide-react';

type Props = {};

export default function VisitorTourModal({}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs p-0 bg-transparent hover:opacity-60 hover:bg-transparent border-none"
        >
          <Button variant="ghost" size="sm">
            <LocateFixedIcon />
            <p>تور ویزیت</p>
          </Button>
          {/* <Eye className="h-4 w-4" /> */}
          {/* <EllipsisVertical className="flex md:hidden" /> */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]   p-0 border-none  text-sm">
        <DialogHeader
          dir="ltr"
          className="bg-primary rounded-t-xl px-10 h-[44px] flex flex-col items-end justify-center border-b "
        >
         <div className='text-white md:text-base text-sm'>
         <DialogTitle className='text-base font-semibold'>تور ویزیت</DialogTitle>
         </div>
        </DialogHeader>
        <div className="flex  min-h-[500px] flex-col gap-2 justify-start items-start  py-4 px-6">
          <div className="">
            <label className="text-sm ">منطقه</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب منطقه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tehran">تهران</SelectItem>
                <SelectItem value="isfahan">اصفهان</SelectItem>
                <SelectItem value="shiraz">شیراز</SelectItem>
                <SelectItem value="mashhad">مشهد</SelectItem>
                <SelectItem value="tabriz">تبریز</SelectItem>
                <SelectItem value="kerman">کرمان</SelectItem>
                <SelectItem value="yazd">یزد</SelectItem>
                <SelectItem value="ahvaz">اهواز</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <label className="text-sm ">تاریخ</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب تاریخ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1403/03/15">۱۵ فروردین ۱۴۰۳</SelectItem>
                <SelectItem value="1403/03/16">۱۶ فروردین ۱۴۰۳</SelectItem>
                <SelectItem value="1403/03/17">۱۷ فروردین ۱۴۰۳</SelectItem>
                <SelectItem value="1403/03/18">۱۸ فروردین ۱۴۰۳</SelectItem>
                <SelectItem value="1403/03/19">۱۹ فروردین ۱۴۰۳</SelectItem>
                <SelectItem value="1403/03/20">۲۰ فروردین ۱۴۰۳</SelectItem>
                <SelectItem value="1403/03/21">۲۱ فروردین ۱۴۰۳</SelectItem>
                <SelectItem value="1403/03/22">۲۲ فروردین ۱۴۰۳</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
