import { Typography, Box } from '@mui/material';
import Link from 'next/link';

function BestSellerHeader() {
  return (
    <Box
      sx={{
        display: 'flex',
        mt: { xs: '1rem', md: '4rem' },
        mb: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h5"
        fontWeight="800"
        fontFamily="inherit"
        gutterBottom
        sx={{ fontSize: { xs: '1.4rem', md: '2.1rem' } }}
      >
        Best Sellers
      </Typography>
      <Link href={'/collection/best-sellers'}>
        <Typography 
          color="#6B7280"
          sx={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#333',
              fontWeight: '600',
            }
          }}
        >
          View all
        </Typography>
      </Link>
    </Box>
  );
}

export default BestSellerHeader;
