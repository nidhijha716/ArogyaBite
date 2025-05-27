import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Chip, 
  List,
  ListItem,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
  Stack
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const ResultCard = ({ result }) => {
  const theme = useTheme();
  
  if (!result) return null;

  const { 
    score, 
    allergies = [], 
    ingredients = []
  } = result;

  // Health rating color based on score
  const getRatingColor = (rating) => {
    if (rating < 30) return theme.palette.error.main;
    if (rating < 60) return theme.palette.warning.main;
    if (rating < 80) return theme.palette.success.main;
    return theme.palette.primary.main;
  };

  // Get rating text based on score
  const getRatingText = (rating) => {
    if (rating < 30) return 'Poor';
    if (rating < 60) return 'Moderate';
    if (rating < 80) return 'Good';
    return 'Excellent';
  };
  
  // Determine allergen severity
  const getAllergySeverity = () => {
    if (!allergies || allergies.length === 0) return 'none';
    const highSeverity = allergies.some(a => a.severity === 'high');
    const mediumSeverity = allergies.some(a => a.severity === 'medium');
    if (highSeverity) return 'high';
    if (mediumSeverity) return 'medium';
    return 'low';
  };

  // Get appropriate allergen summary tag
  const getAllergenSummaryTag = () => {
    const severity = getAllergySeverity();
    
    switch(severity) {
      case 'high':
        return {
          text: "High Allergy Risk",
          color: "error",
          icon: <ErrorIcon />,
        };
      case 'medium':
        return {
          text: "Moderate Allergy Risk",
          color: "warning",
          icon: <WarningIcon />,
        };
      case 'low':
        return {
          text: "Low Allergy Risk",
          color: "info",
          icon: <InfoOutlinedIcon />,
        };
      default:
        return {
          text: "Allergy Safe",
          color: "success",
          icon: <CheckCircleIcon />,
        };
    }
  };

  const allergenTag = getAllergenSummaryTag();

  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: theme.shadows[2]
      }}
    >
      {/* Header - Allergy Risk Only */}
      <Box 
        sx={{ 
          p: 3,
          textAlign: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Chip 
          icon={allergenTag.icon}
          label={allergenTag.text} 
          color={allergenTag.color} 
          variant="filled"
          sx={{ 
            fontWeight: 700,
            fontSize: '1rem',
            height: 36,
            px: 2,
            '& .MuiChip-icon': { 
              color: 'inherit',
              fontSize: '1.2rem',
              ml: 0.5 
            }
          }}
        />
      </Box>
      
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* Health Rating Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
                background: alpha(getRatingColor(score), 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                color: getRatingColor(score)
              }}
            >
              <LocalFireDepartmentIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Health Rating: {getRatingText(score)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: '100%', mr: 1.5 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={score} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    background: alpha(theme.palette.grey[300], 0.3),
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${alpha(getRatingColor(score), 0.8)} 0%, ${getRatingColor(score)} 100%)`,
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              <Box sx={{ minWidth: 45 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: getRatingColor(score) }}>
                  {score}/100
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        
        {/* Ingredients List */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
                background: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                color: theme.palette.primary.main
              }}
            >
              <ArticleOutlinedIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Ingredients
            </Typography>
          </Box>
          
          <Paper
            elevation={0}
            sx={{
              background: alpha(theme.palette.background.default, 0.5),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: 'hidden'
            }}
          >
            <List dense disablePadding>
              {ingredients.map((ingredient, index) => {
                // Check if ingredient contains any allergen
                const isAllergen = allergies.some(allergen => 
                  ingredient.toLowerCase().includes(allergen.name.toLowerCase())
                );
                
                return (
                  <ListItem 
                    key={index}
                    disablePadding
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      borderBottom: index < ingredients.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                      background: isAllergen 
                        ? alpha(theme.palette.error.light, 0.1) 
                        : 'transparent',
                      '&:hover': {
                        background: isAllergen 
                          ? alpha(theme.palette.error.light, 0.15) 
                          : alpha(theme.palette.grey[300], 0.1)
                      }
                    }}
                  >
                    <ListItemText 
                      primary={ingredient} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: isAllergen 
                          ? theme.palette.error.main 
                          : theme.palette.text.primary,
                        fontWeight: isAllergen ? 600 : 400,
                        fontSize: '0.9rem'
                      }}
                    />
                    {isAllergen && (
                      <Chip 
                        label="Allergen" 
                        color="error" 
                        size="small" 
                        sx={{ 
                          height: 22, 
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          '&.MuiChip-filled': {
                            color: theme.palette.getContrastText(theme.palette.error.main)
                          }
                        }}
                      />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ResultCard;