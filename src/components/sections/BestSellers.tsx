"use client";
import { Grid, useMediaQuery, useTheme, Box, Typography } from "@mui/material";
import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import SkeletonData from "../utility/SkeletonData";
import BestSellerHeader from "@/src/components/headers/BestSellerHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import { BestSellersData } from "@/src/lib/utilits/BestSellersData";
import Image from "next/image";
import Link from "next/link";
import { useGSAPAnimations } from '@/src/hooks/useGSAPAnimations';

const BestSellers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoading, setIsLoading] = useState(true);
  const { bestSellersRef } = useGSAPAnimations();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Container ref={bestSellersRef}>
      <BestSellerHeader />
      {isLoading ? (
        <Grid container spacing={{ xs: 2 }} item>
          {Array.from({ length: 3 }, (_, index) => (
            <Grid item md={4} xs={6} key={index}>
              <SkeletonData />
            </Grid>
          ))}
        </Grid>
      ) : isMobile ? (
        <Swiper
          style={{ paddingBottom: "4rem" }}
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          loop={true}
          slidesPerView={2}
          pagination={{ clickable: true }}
        >
          {BestSellersData.slice(0, 4).map((item) => (
            <SwiperSlide key={item.id}>
              <Box sx={{ position: "relative" }} className="product-card">
                <Image
                  src={item.src}
                  alt={`Best Seller ${item.name}`}
                  width={300}
                  height={400}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    border: "2px solid #6B7280",
                    borderRadius: "8px",
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" fontWeight="600" color="#6B7280">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="#6B7280">
                    {item.price}
                  </Typography>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Grid container spacing={{ lg: 2, md: 2 }}>
          {BestSellersData.slice(0, 3).map((item, index) => (
            <Grid
              item
              md={4}
              xs={6}
              key={index}
              sx={{ rowGap: "17rem", mb: { xs: "3rem" } }}
              position="relative"
            >
              <Link href={`/collection/best-sellers`} style={{ color: 'inherit' }}>
                <Box sx={{ position: "relative" }} className="product-card">
                  <Image
                    src={item.src}
                    alt={`Best Seller ${item.name}`}
                    width={400}
                    height={400}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      border: "2px solid #6B7280",
                      borderRadius: "8px",
                    }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" fontWeight="600" color="#6B7280">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="#6B7280">
                      {item.price}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BestSellers;