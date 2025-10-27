'use client';

import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import Footer from '@/src/components/layout/Footer';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import Link from 'next/link';

const page = () => {
  return (
    <>
      <BannerHeader />
      <NavBar />
      
      <Container>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            mt: 2,
            mb: 4,
          }}
        >
          <Link href="/">
            <Typography sx={{ color: '#6B7280' }}> Home</Typography>
          </Link>
          <span>/</span>
          <Typography>About Us - Quality Standards</Typography>
        </Box>
      </Container>
      
      <Container>
        <Box sx={{ mt: 5, mb: 10 }}>
          <Typography variant="h4" fontFamily="inherit" fontWeight={600} sx={{ mb: 4, color: '#6B7280' }}>
            About Soocha Scrubs
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, color: '#6B7280' }}>
            Our Mission
          </Typography>
          <Typography sx={{ mb: 4 }}>
            At Soochuh Scrubs, we are dedicated to providing healthcare professionals with 
            high-quality, comfortable, and durable medical scrubs that meet the demanding 
            standards of modern healthcare environments. Our mission is to support healthcare 
            workers with premium scrubs that enhance their professional appearance while 
            ensuring comfort during long shifts.
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: '#6B7280' }}>
                    Quality Standards
                  </Typography>
                  <Typography>
                    Every pair of Soochuh scrubs undergoes rigorous quality testing to ensure 
                    durability, comfort, and professional appearance. We use only premium 
                    materials that meet healthcare industry standards for safety and performance.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: '#6B7280' }}>
                    Materials
                  </Typography>
                  <Typography>
                    Our scrubs are crafted from high-quality polyester-cotton blends that 
                    offer the perfect balance of comfort, durability, and easy care. 
                    All materials are tested for colorfastness, shrinkage, and wear resistance.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: '#6B7280' }}>
                    Manufacturing
                  </Typography>
                  <Typography>
                    We partner with certified manufacturers who adhere to strict quality 
                    control standards. Our production processes ensure consistent sizing, 
                    color matching, and professional finishing on every garment.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: '#6B7280' }}>
                    Care Instructions
                  </Typography>
                  <Typography>
                    Our scrubs are designed for easy care and long-lasting wear. Machine 
                    washable in cold water, tumble dry on low heat, and maintain their 
                    professional appearance through countless wash cycles.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mb: 3, color: '#6B7280' }}>
            Our Team
          </Typography>
          <Typography sx={{ mb: 4 }}>
            The Soochuh Scrubs team consists of healthcare professionals, fashion designers, 
            and quality assurance experts who understand the unique needs of medical workers. 
            We combine medical industry knowledge with fashion expertise to create scrubs 
            that are both functional and stylish.
          </Typography>

          <Box sx={{ 
            backgroundColor: '#F0F2EF', 
            padding: '2rem', 
            borderRadius: '8px',
            mt: 4 
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#6B7280' }}>
              Healthcare Professional Partnership
            </Typography>
            <Typography>
              We work closely with healthcare facilities to provide custom solutions, 
              bulk ordering, and specialized requirements. Our team understands the 
              demands of healthcare environments and designs our products accordingly.
            </Typography>
          </Box>
        </Box>
      </Container>
      
      <Footer />
    </>
  );
};

export default page;