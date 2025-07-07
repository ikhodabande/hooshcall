import { Button } from '@/components/ui/button';
import HesabdariCustomers from '@/public/assets/static-image/visitor-table/hesabdari-customers.svg';
import SeeVisitors from '@/public/assets/static-image/visitor-table/see-visitors.svg';
import Link from 'next/link';

const VisitorsBtns = [
  { btnName: 'مشاهده بازایاب ها', icon: SeeVisitors, link: 'table' },
  // { btnName: 'مشاهده تراکنش ها', icon: SeeTransactions, link: 'view-transactions' },
  { btnName: 'مشتریان حسابداری', icon: HesabdariCustomers, link: 'customers' },
  // { btnName: 'مشتریان اپ', icon: AppCustomers, link: '' },
];

export default function Visitors() {
  return (
    <div className="grid grid-cols-2  md:px-0 md:flex flex-wrap justify-center content-center items-center gap-6 w-full h-full pt-6 md:pt-0 md:min-h-[70vh] max-w-6xl mx-auto">
      {VisitorsBtns.map((visitor, index) => (
        <Link
          key={index}
          className="place-content-center md:w-[286px] md:h-[198px] h-full w-full place-self-center"
          href={`/dashboard/visitors/${visitor.link}`}
        >
          <Button
            variant="option"
            className="w-full h-full flex flex-col items-center justify-center gap-4"
          >
            <div
              className="w-20 h-20 bg-primary mask mask-image"
              style={{
                WebkitMaskImage: `url(${visitor.icon.src})`,
                maskImage: `url(${visitor.icon.src})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
              }}
            />

            <p>{visitor.btnName}</p>
          </Button>
        </Link>
      ))}
    </div>
  );
}
