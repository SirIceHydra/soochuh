import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { Button, Typography, useMediaQuery } from '@mui/material';
import HeroImage from '@/public/new/banner.webp';
import { Box } from '@mui/material';
import { useGSAPAnimations } from '@/src/hooks/useGSAPAnimations';

function HeroSection() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const { heroRef } = useGSAPAnimations();

  return (
    <Box
      ref={heroRef}
      position="relative"
      width="100%"
      sx={{ height: { xs: '300px', sm: '400px', md: '600px' } }}
    >
      <Image
        src={HeroImage}
        alt="Image for hero"
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          objectPosition: '30% 40%',
        }}
        width={1441}
        height={600}
        quality={100}
        priority
      />
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '75%', sm: '70%', md: '70%' },
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          className="hero-button"
          sx={{
            bgcolor: '#ffff',
            color: '#0C0C0C',
            textTransform: 'none',
            px: { sm: 4, md: 6 },
            py: 2,
            borderRadius: 'none',
            fontWeight: 'bold',
            fontSize: { xs: '14px', md: '16px' },
            border: '2px solid #333',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: '#333',
              color: '#fff',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          SHOP NOW
        </Button>
      </Box>
    </Box>
  );
}

export default HeroSection;
