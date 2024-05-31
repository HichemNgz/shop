import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface Image {
  original: string;
}

interface Props {
  combineImages: Image[];
}

const ImageCarousel: React.FC<Props> = ({ combineImages }) => {
  // Set the initial main image to the first image in the array
  const [mainImage, setMainImage] = useState(combineImages[0]?.original);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };

  useEffect(() => {
    console.log(combineImages);
  }, [combineImages]);

  return (
    <div className="flex flex-col items-center">
      {/* Main Image */}
      <div className="w-full mb-4">
        <Image
          className="w-full max-w-full"
          src={mainImage}
          alt="product-image"
          width={1000}
          height={1000}
        />
      </div>

      {/* Image Carousel */}
      <div className="w-full overflow-hidden cursor-grabbing">
        <Carousel responsive={responsive} className="w-full">
          {combineImages?.map((image, index) => (
            <Image
              key={index}
              src={image.original}
              width={1000}
              height={1000}
              alt="product image"
              className="image-zoom w-24 h-24 object-cover border border-gray-300 rounded-lg shadow-md "
              onClick={() => setMainImage(image.original)}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ImageCarousel;
