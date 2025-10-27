import { Box, Grid, Typography, TextField } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import CopyrightIcon from "@mui/icons-material/Copyright";
import FooterGridMobile from "./FooterGridMobile";
import Link from "next/link";

function FooterGridDesktop() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8} md={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              Join our Healthcare Professional Club, get 15% off for your Birthday
            </Typography>
            <form>
              <TextField
                placeholder="Enter your name"
                sx={{
                  width: "100%",
                  "& fieldset": {
                    borderColor: "#ffff",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <ArrowForwardIcon sx={{ color: "#ffff" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <FormControlLabel
              control={<Checkbox />}
              label="By Submitting your email, you agree to receive updates from Soochuh Scrubs."
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontWeight: "600",
                  width: "100%",
                  fontSize: "15px",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <Box sx={{ display: "flex", gap: "10px" }}>
              <InstagramIcon sx={{ fontSize: "30px" }} />
              <FacebookOutlinedIcon sx={{ fontSize: "30px" }} />
              <PinterestIcon sx={{ fontSize: "30px" }} />
              <TwitterIcon sx={{ fontSize: "30px" }} />
            </Box>

            <Box sx={{ display: "flex", gap: "10px" }}>
              <CopyrightIcon />
              <Typography>2024 Soochuh Scrubs. All Rights Reserved.</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "4px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            Help & Support
          </Typography>

          <Typography>Medical Scrubs</Typography>
          <Typography>Quality Standards</Typography>
          <Typography>Privacy Policy</Typography>
          <Typography>Support System</Typography>
          <Typography>Terms & Condition</Typography>
          <Typography>Copyright Notice</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} md={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "4px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            Help & Support
          </Typography>

          <Typography>Orders & Shipping</Typography>
          <Typography>Returns & Refunds</Typography>
          <Link href="/faq">
            <Typography sx={{ color: "#ffff" }}>FAQs</Typography>
          </Link>
          <Link href="/contact-us">
            <Typography sx={{ color: "#ffff" }}>Contact Us</Typography>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4} md={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "4px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "600" }}>
            Soochuh Scrubs
          </Typography>

          <Typography>Careers</Typography>
          <Typography>Visit Us</Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default FooterGridDesktop;
