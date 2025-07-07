import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PackageSearch } from 'lucide-react';

type Props = {};

export default function AnbarakSettingModal({}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs p-0 bg-transparent hover:opacity-60 hover:bg-transparent border-none"
        >
          <Button variant="ghost" size="sm">
            <PackageSearch />
            <p> تنظیم انبارک</p>{' '}
          </Button>
          {/* <Eye className="h-4 w-4" /> */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-none text-sm">
        <DialogHeader
          dir="ltr"
          className=" flex flex-col items-end px-6 justify-start border-b pb-4"
        >
          <DialogTitle>جزئیات سفارش #</DialogTitle>
          <DialogDescription>اطلاعات کامل سفارش مشتری </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">اطلاعات مشتری</h4>
              <p>نام: </p>
              <p>شماره تماس: </p>
              <p>آدرس: </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">اطلاعات سفارش</h4>
              <p>تاریخ: </p>
              <p>
              </p>
              <p>روش پرداخت:</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">محصولات</h4>
            <div className="border rounded-md">
              <div className="grid grid-cols-4 gap-2 p-2 bg-muted font-medium">
                <div>نام محصول</div>
                <div>قیمت</div>
                <div>تعداد</div>
                <div>جمع</div>
              </div>
              {/* {order.fullDetails.products.map((product, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 p-2 border-t text-sm">
                      <div>{product.name}</div>
                      <div>{product.price.toLocaleString()} تومان</div>
                      <div>{product.quantity}</div>
                      <div>{(product.price * product.quantity).toLocaleString()} تومان</div>
                    </div>
                  ))} */}
              <div className="grid grid-cols-4 gap-2 p-2 border-t font-medium">
                <div className="col-span-3 text-left">مجموع:</div>
                <div> تومان</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-1">یادداشت</h4>
            <p className="text-sm text-muted-foreground"></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
