"use client";
import BannerHeader from "@/src/components/headers/BannerHeader";
import Footer from "@/src/components/layout/Footer";
import NavBar from "@/src/components/layout/NavBar";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

const FaqQuestion = () => {
  return (
    <>
      <BannerHeader />
      <NavBar />
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            mt: 2,
            mb: 4,
          }}
        >
          <Link href="/">
            <Typography sx={{ color: "#6B7280" }}> Home</Typography>
          </Link>
          <span>/</span>
          <Typography>FAQ - Medical Scrubs</Typography>
        </Box>
      </Container>
      
      <Container>
        <Box sx={{ mt: 5, mb: 10 }}>
          <Typography variant="h4" fontFamily="inherit" fontWeight={600} sx={{ mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#6B7280" }}>
              About Our Medical Scrubs
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>What materials are used in Soochuh medical scrubs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Our medical scrubs are made from high-quality, durable fabrics including polyester-cotton blends 
                  that are comfortable, breathable, and easy to care for. All materials meet healthcare industry 
                  standards for durability and professional appearance.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Do you offer custom embroidery for medical scrubs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Yes! We offer custom embroidery services for hospitals, clinics, and healthcare facilities. 
                  Contact our team for bulk orders and custom branding options.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>What sizes are available for medical scrubs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We offer a comprehensive size range from XS to 5XL, including plus sizes. Our scrubs are 
                  designed to fit comfortably for all healthcare professionals. Check our size guide for 
                  detailed measurements.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#6B7280" }}>
              Orders & Shipping
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>What is your shipping policy for medical scrubs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We offer free shipping on orders over R1,350. Standard shipping takes 3-5 business days, 
                  with expedited options available for urgent orders. Bulk orders for healthcare facilities 
                  receive priority processing.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Do you offer bulk discounts for hospitals and clinics?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Yes, we offer special pricing for bulk orders and hospital partnerships. Contact our 
                  sales team for custom quotes and volume discounts on medical scrub orders.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>What is your return policy for medical scrubs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We offer a 30-day return policy for unworn items with tags attached. Custom embroidered 
                  items are final sale. Contact our customer service team for return authorization.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#6B7280" }}>
              Care & Maintenance
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>How should I care for my medical scrubs?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Machine wash in cold water with like colors. Use mild detergent and avoid bleach. 
                  Tumble dry on low heat or hang to dry. Iron on low heat if needed. This ensures 
                  longevity and maintains the professional appearance.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Are your medical scrubs stain-resistant?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Our scrubs are treated with stain-resistant finishes and are designed to withstand 
                  the rigors of healthcare environments. However, we recommend treating stains promptly 
                  for best results.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Container>
      
      <Footer />
    </>
  );
};

export default FaqQuestion;