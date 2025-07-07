import { Button } from '@/components/ui/button';
import chooseProducts from '@/public/assets/static-image/products/hide-products.svg';
import seeProducts from '@/public/assets/static-image/products/see-products.svg';
import HesabdariCustomers from '@/public/assets/static-image/visitor-table/hesabdari-customers.svg';
import SeeVisitors from '@/public/assets/static-image/visitor-table/see-visitors.svg';
import Link from 'next/link';

const VisitorsBtns = [
  { btnName: 'تنظیمات فروشگاه', icon: SeeVisitors, link: 'settings' },
  { btnName: 'مشتریان فروشگاه', icon: HesabdariCustomers, link: 'customers' },
  { btnName: 'لیست کالا', icon: seeProducts, link: 'products' },
  { btnName: 'تایید دومرحله ای', icon: chooseProducts , link: 'settings/second-authenticator' },
  // { btnName: 'تصویر کالا با AI', icon: chooseProducts, link: 'products/image' },
];

export default function Shop() {
  return (
    <div className="grid grid-cols-1 px-1 md:px-0 md:flex flex-wrap justify-center content-center items-center md:gap-6 gap-4 w-full h-full pt-6 md:pt-0 md:min-h-[70vh] max-w-6xl mx-auto">
      {VisitorsBtns.map((visitor, index) => (
        <Link
          key={index}
          className="place-content-center md:w-[286px] md:h-[198px] h-full w-full place-self-center"
          href={`/dashboard/shop/${visitor.link}`}
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
