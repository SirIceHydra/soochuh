import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';

function BannerHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ position: 'relative', zIndex: 10 }}>
      <Typography
        sx={{
          fontWeight: { xs: "500", sm: "500", md: "600", lg: "600" },
          letterSpacing: { xs: "0px", sm: "0px", md: "1px", lg: "2px" },
          fontSize: { xs: "10px", sm: "13px", md: "14px", lg: "15px" },
          lineHeight: 1.2,
          textAlign: { xs: "right", sm: "center", md: "center" },
          p: { xs: "8px 24px 8px 16px", sm: "8px 16px", md: "8px 16px" },
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-end", sm: "center", md: "center" },
        }}
        bgcolor="#6B7280"
        color="text.secondary"
      >
        {isMobile ? "Free Shipping Over R1,350" : "Free Shipping on Orders Over R1,350 | Professional Medical Scrubs"}
      </Typography>
    </Box>
  );
}

export default BannerHeader;
