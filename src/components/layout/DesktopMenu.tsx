import { Box, List, ListItemText, ListItem } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

interface Option {
  name?: string;
}
interface DesktopMenu {
  options: Option[];
  setIsHovered: (hover: string) => void;
  setIsOpen: (hover: boolean) => void;
}

function DesktopMenu(props: PropsWithChildren<DesktopMenu>) {
  const { options, setIsHovered, setIsOpen } = props;

  const pathName = usePathname();
  const hrefLink = options.map((option) =>
    option.name?.toLowerCase().replace(/\s+/g, "-")
  );

  return (
    <Box sx={{ display: { xs: "none", md: "flex" } }}>
      <List
        sx={{
          display: "flex",
          gap: { md: "24px" },
          p: 0,
        }}
      >
        {options.map((option, index) => {
          const isActive = pathName.startsWith(`/${hrefLink[index]}`);
          const isHomePage = pathName === '/';
          
          return (
            <Box
              key={index}
              onMouseOver={() => {
                setIsHovered(option.name!);
                setIsOpen(true);
              }}
              onMouseLeave={() => {
                setIsHovered('');
                setIsOpen(false);
              }}
              sx={{
                cursor: isHomePage ? 'not-allowed' : 'pointer',
                opacity: isHomePage ? 0.7 : 1,
                '&:hover': {
                  opacity: isHomePage ? 0.7 : 1,
                }
              }}
            >
              <ListItem>
                <ListItemText
                  primary={option.name}
                  sx={{ 
                    color: isActive ? "#748C70" : isHomePage ? "#999" : "inherit",
                    pointerEvents: isHomePage ? 'none' : 'auto'
                  }}
                />
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}

export default DesktopMenu;
