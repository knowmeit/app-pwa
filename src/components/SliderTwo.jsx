import React from "react";
import { Scrollbar, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination"; // Add this line to import pagination styles

const SliderComponentTwo = () => {
  return (
    <div className="slider-container">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000, // 2 seconds
          disableOnInteraction: false,
        }}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true, type: "bullets" }}
        loop={true} /* Enable continuous loop */
      >
        <SwiperSlide>
          <div className="slide">
            <img src="/images/1.png" alt="Slide 1" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src="/images/2.png" alt="Slide 2" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src="/images/3.png" alt="Slide 3" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src="/images/4.png" alt="Slide 4" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src="/images/5.png" alt="Slide 5" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src="/images/6.png" alt="Slide 6" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SliderComponentTwo;
