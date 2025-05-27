import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Box, 
  Typography, 
  Paper, 
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import EggIcon from '@mui/icons-material/EggAlt';
import GrassIcon from '@mui/icons-material/Grass';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WaterIcon from '@mui/icons-material/Water';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import GrainIcon from '@mui/icons-material/Grain';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import CrueltyFreeIcon from '@mui/icons-material/CrueltyFree';
import SetMealIcon from '@mui/icons-material/SetMeal';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ScienceIcon from '@mui/icons-material/Science';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';

// const AllergyFilter = ({ selectedAllergies, setSelectedAllergies }) => {
const AllergyFilter = ({ userAllergies }) => {
  const theme = useTheme();

  // Define a color for each allergen
  const allergenColors = {
    'Milk': '#91D7F2',
    'Eggs': '#FFC107',
    'Fish': '#64B5F6',
    'Shellfish': '#FF80AB',
    'Tree Nuts': '#AED581',
    'Peanuts': '#FFB74D',
    'Wheat': '#FFEE58',
    'Soybeans': '#81C784',
    'Sesame': '#CE93D8',
    'Gluten': '#FFCC80',
    'Sulfites': '#E0E0E0',
    'Mustard': '#FFAB91',
    'MSG': '#B39DDB',
    'Artificial Sweeteners': '#F48FB1'
  };

  // Icons for allergens
  const allergenIcons = {
    'Milk': <KitchenIcon />,
    'Eggs': <EggIcon />,
    'Fish': <SetMealIcon />,
    'Shellfish': <SetMealIcon />,
    'Tree Nuts': <GrainIcon />,
    'Peanuts': <GrainIcon />,
    'Wheat': <BakeryDiningIcon />,
    'Soybeans': <GrassIcon />,
    'Sesame': <GrassIcon />,
    'Gluten': <BakeryDiningIcon />,
    'Sulfites': <ScienceIcon />,
    'Mustard': <SoupKitchenIcon />,
    'MSG': <ScienceIcon />,
    'Artificial Sweeteners': <ScienceIcon />
  };


  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Box sx={{ 
        p: 3, 
        pb: 2,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        borderBottom: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.7)
      }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <FilterAltIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />
          Your Allergy Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          These allergens will be checked in products
        </Typography>
      </Box>
  
      {/* Allergies Display Section */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {userAllergies.length > 0 ? (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                bgcolor: alpha(theme.palette.success.main, 0.05),
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha(theme.palette.success.main, 0.2)
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <CheckCircleOutlineIcon color="success" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {userAllergies.length} {userAllergies.length === 1 ? 'allergen' : 'allergens'} configured
                </Typography>
              </Box>
              
              {/* Allergies Chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userAllergies.map((allergen) => (
                  <Chip
                    key={allergen}
                    label={allergen}
                    size="medium"
                    sx={{
                      bgcolor: allergenColors[allergen] ? alpha(allergenColors[allergen], 0.12) : undefined,
                      borderColor: allergenColors[allergen] ? alpha(allergenColors[allergen], 0.3) : undefined,
                      cursor: 'default', // Disable pointer
                      '&:hover': {
                        bgcolor: allergenColors[allergen] ? alpha(allergenColors[allergen], 0.15) : undefined
                      }
                    }}
                    avatar={
                      <Avatar sx={{ 
                        bgcolor: allergenColors[allergen] ? alpha(allergenColors[allergen], 0.2) : undefined,
                        color: allergenColors[allergen]
                      }}>
                        {allergenIcons[allergen]}
                      </Avatar>
                    }
                  />
                ))}
              </Box>
            </Paper>
  
            <Typography variant="caption" color="text.secondary">
              To update allergies, visit your profile settings.
            </Typography>
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.warning.main, 0.2)
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No allergies saved in your profile yet.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AllergyFilter; 