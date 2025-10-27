import { Button, Grid, Skeleton } from "@mui/material";
import { Container } from "@mui/material";
import { Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import Image from "next/image";
import Link from "next/link";
import { ImagesMansory } from "@/src/lib/utilits/ImageData";
import { useState, useEffect } from "react";
import { useGSAPAnimations } from '@/src/hooks/useGSAPAnimations';

function Collection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(true);
  const { collectionRef } = useGSAPAnimations();

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  return (
    <Container ref={collectionRef}>
      {isLoading ? (
        <Box sx={{ mb: 4, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <Skeleton variant="rectangular" height={"100%"} />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Skeleton variant="rectangular" height={640} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Skeleton variant="rectangular" height={340} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="rectangular" height={"100%"} />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <>
          <Box sx={{ mt: "6rem", mb: "1.5rem" }}>
            <Typography
              variant="h5"
              fontWeight="800"
              fontFamily="inherit"
              gutterBottom
              sx={{ fontSize: { xs: '1.4rem', md: '2.1rem' } }}
            >
              Medical Scrubs Collection
            </Typography>
          </Box>
          <Masonry
            columns={2}
            spacing={{ lg: 3, xs: 1 }}
            style={{ columnGap: "6px", rowGap: "0.5rem" }}
          >
            {ImagesMansory.map((item, index) => (
              <Link
                key={item.id}
                href={`/collection/${item.name.toLowerCase()}`}
              >
                <Box sx={{ position: "relative" }} className="collection-card">
                  <Image
                    src={item.src}
                    alt={`Image for ${item.name}`}
                    width={500}
                    height={item.height}
                    style={{
                      objectFit: isMobile ? "contain" : "cover",
                      maxWidth: "100%",
                      height: isMobile ? "auto" : "",
                      border: "2px solid #6B7280",
                      borderRadius: "8px",
                    }}
                    sizes="100vw"
                  />
                  <Typography>{isMobile && `${item.name}`}</Typography>

                  {!isMobile && (
                    <Button
                        sx={{
                          position: "absolute",
                          bottom: "1rem",
                          left: "1rem",
                          textTransform: "capitalize",
                          color: "#000",
                          padding: "0.5rem 1.5rem",
                          background: "#fff",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          '&:hover': {
                            background: "#333",
                            color: "#fff",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                    >
                      {item.name}
                    </Button>
                  )}
                </Box>
              </Link>
            ))}
          </Masonry>{" "}
        </>
      )}
    </Container>
  );
}

export default Collection;
