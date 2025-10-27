import { Box } from "@mui/material";
import Image from "next/image";
import LogoMobile from "@/public/new/Logos/cropped-SOOCHA-LOGO-02.png";
import Link from "next/link";

function LogoMobileWebsite() {
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "60px",
        height: "19px",
      }}
    >
      <Link href='/'>
        <Image 
          alt="Logo for shop" 
          src={LogoMobile}
          width={48}
          height={15}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Link>
    </Box>
  );
}

export default LogoMobileWebsite;
