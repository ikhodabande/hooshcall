'use client'

import { Button } from '@/components/ui/button';
import recieveFactor from '@/public/assets/static-image/orders/receive-factor.svg';
import recievePishFaktor from '@/public/assets/static-image/orders/recieve-pishfactor.svg';
import bestProducts from '@/public/assets/static-image/products/best-products.svg';
import Link from 'next/link';

type Props = {};

const VisitorsBtns = [
  { btnName: 'سفارشات', icon: bestProducts, link: 'order-status' },
  // { btnName: 'دریافت فاکتور', icon: recieveFactor, link: 'recieve-faktor' },
  { btnName: 'دریافت پیش فاکتور', icon: recievePishFaktor, link: 'recieve-pishfaktor' },
];

export default function Orders({}: Props) {
  return (
    <>
      {/* <DashboardLayout /> */}
      <div className="grid grid-cols-2  md:px-0 md:flex flex-wrap justify-center content-center items-center gap-6 w-full h-full pt-6 md:pt-0 md:min-h-[70vh] max-w-6xl mx-auto ">
        {VisitorsBtns.map((visitor, index) => (
          <Link
            className=" place-content-center md:w-[286px] md:h-[198px] h-full w-full place-self-center"
            key={index}
            href={`/dashboard/orders/${visitor.link}`}
          >
            <Button
              key={visitor.btnName}
              variant={'option'}
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
    </>
  );
}
