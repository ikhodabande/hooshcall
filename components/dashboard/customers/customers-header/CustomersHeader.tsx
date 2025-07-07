import { Button } from '@/components/ui/button';

type Props = {};

const options = [
  // { name: 'ارسال مشتری به اپ', link: '', icon: '' },
  { name: 'مشاهده مشتریان', link: '', icon: '' },
  { name: 'مشتریان حسابداری', link: '', icon: '' },
  // { name: 'ارسال پیام تایید ارسال کد', link: '', icon: '' },
  { name: 'بروزرسانی وضعیت سفارش', link: '', icon: '' },
];

export default function CustomersHeader({}: Props) {
  return (
    <>
      <div className="w-full absolute top-28 -right-56 z-40 flex flex-col sm:flex-row gap-4 items-center justify-center">
        {options.map(opt => (
          <>
            <Button variant="ghost" className="p-6 bg-background  ">
              {opt.name}
            </Button>
          </>
        ))}
      </div>
    </>
  );
}
