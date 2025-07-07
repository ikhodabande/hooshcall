import { Button } from '@/components/ui/button';
import seeProducts from '@/public/assets/static-image/products/see-products.svg';
import chooseProducts from '@/public/assets/static-image/products/choose-product-image.svg';

import Link from 'next/link';

type Props = {};

const VisitorsBtns = [
  // { btnName: 'تنظیم کالاها منتخب', icon: bestProducts, link: 'table' },
  // { btnName: 'انتخاب عکس کالا', icon: chooseProductsImage, link: '' },
  // { btnName: 'مخفی کردن کالا', icon: hideProducts, link: 'customers' },
  { btnName: 'مشاهده کالاها', icon: seeProducts, link: 'list' },
  { btnName: 'تصویر کالا با AI', icon: chooseProducts, link: 'choose-picture'}
  // { btnName: 'انتخاب اشانتیون کالا', icon: addEshantiun, link: 'eshantiun' },
];

export default function Products({}: Props) {
  return (
    <>
      {/* <DashboardLayout /> */}
      <div className="grid grid-cols-2  md:px-0 md:flex flex-wrap justify-center content-center items-center gap-6 w-full h-full pt-6 md:pt-0 md:min-h-[70vh] max-w-6xl mx-auto ">
        {VisitorsBtns.map((visitor, index) => (
          <Link
            className=" place-content-center md:w-[286px] md:h-[198px] h-full w-full place-self-center"
            key={index}
            href={`/dashboard/products/${visitor.link}`}
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
