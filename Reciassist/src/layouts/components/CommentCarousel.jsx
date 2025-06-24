import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';
import { mockComments } from '../../data/mockData';
import '../../assets/styles/Carousel.css';
const PeopleLikeCarousel = () => {
  const itemTemplate = (comment) => (
    <Card className="shadow-md rounded-lg p-4 mx-2">
      <div className="flex items-center gap-3 mb-2">
        <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-semibold">{comment.user.name}</div>
          <div className="text-sm text-gray-500">{comment.date}</div>
        </div>
      </div>
      <Rating value={comment.rating} readOnly cancel={false} />
      <p className="mt-2 text-sm text-gray-700">{comment.comment}</p>
      <p className="text-sm mt-2 text-gray-500">
        <i className="pi pi-thumbs-up mr-1 text-blue-600"></i>Helpful ({comment.helpful})
      </p>
    </Card>
  );

  return (
    <Carousel className="people-like-carousel"
      value={mockComments}
      itemTemplate={itemTemplate}
      numVisible={2}
      numScroll={1}
      autoplayInterval={4000}
      circular
      responsiveLayout={[
        { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
        { breakpoint: '768px', numVisible: 1, numScroll: 1 }
      ]}
    />
  );
};

export default PeopleLikeCarousel;
