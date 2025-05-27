import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  Box,
  Paper,
  Grid,
  Fade,
  Zoom,
  alpha,
  useMediaQuery,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import { AlertCircle, UploadCloud, ScanText, ShieldAlert } from 'lucide-react';
import ImageUploader from './ImageUploader';
import AllergyFilter from './AllergyFilter';
import ResultCard from './ResultCard';
import theme from '../theme';

const OcrScanner = () => {
  const [userAllergies, setUserAllergies] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appReady, setAppReady] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 100);
    const fetchAllergies = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          console.error("No email found in localStorage");
          return;
        }
        const response = await axios.get(`http://127.0.0.1:5000/get-allergies?email=${email}`);
        if (response.data.allergies) {
          setUserAllergies(response.data.allergies);
        }
      } catch (error) {
        console.error("Failed to fetch allergies:", error);
        setError("Failed to load your allergy profile");
      }
    };
    fetchAllergies();
    return () => clearTimeout(timer);
  }, []);

  const handleImageSelected = async (imageData) => {
    setLoading(true);
    setError('');
    setAnalysisResult(null);
    try {
      // Simulate API call - replace with your actual implementation
      // const extractedText = await extractTextFromImage(imageData);
      // const result = await analyzeIngredients(extractedText, userAllergies);
      // setAnalysisResult(result);
      
      // Mock response for demonstration
      setTimeout(() => {
        setAnalysisResult({
          productName: "Organic Peanut Butter",
          brandName: "Nature's Best",
          score: 72,
          isSafe: true,
          allergies: [],
          additives: [],
          aiComment: "This product contains high-quality ingredients with minimal processing.",
          ingredients: [
            "Organic peanuts",
            "Sea salt"
          ]
        });
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to analyze image.');
      setLoading(false);
    }
  };

  const looksLikeIngredientsList = (text) => {
    // Your existing implementation
    return true;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #111827, #1F2937)',
          py: 8,
          px: 2
        }}
      >
        <Fade in={appReady} timeout={800}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
              {/* Header */}
              <Box textAlign="center" mb={6}>
                <Box display="inline-flex" alignItems="center" gap={2} mb={2}>
                  <ScanText size={40} color={theme.palette.primary.main} />
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(to right, #10B981, #3B82F6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Ingredient Scanner
                  </Typography>
                </Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Upload an image of product ingredients to analyze for allergens and health factors
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Zoom in={appReady} timeout={500}>
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        borderRadius: 3,
                        background: alpha(theme.palette.background.paper, 0.8),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.3),
                        boxShadow: theme.shadows[2]
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <ShieldAlert size={24} color={theme.palette.warning.main} />
                        <Typography variant="h6" fontWeight={600}>
                          Your Allergy Profile
                        </Typography>
                      </Box>
                      <AllergyFilter userAllergies={userAllergies} />
                    </Paper>
                  </Zoom>
                </Grid>

                <Grid item xs={12} md={7}>
                  <Zoom in={appReady} timeout={700}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: alpha(theme.palette.background.paper, 0.8),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.3),
                        boxShadow: theme.shadows[2]
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <UploadCloud size={24} color={theme.palette.primary.main} />
                        <Typography variant="h6" fontWeight={600}>
                          Upload Ingredients
                        </Typography>
                      </Box>
                      <ImageUploader 
                        onImageSelected={handleImageSelected}
                        loading={loading}
                      />
                    </Paper>
                  </Zoom>
                </Grid>
              </Grid>

              {loading && (
                <Fade in timeout={600}>
                  <Box mt={4} display="flex" justifyContent="center">
                    <Paper
                      sx={{
                        p: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderRadius: 3,
                        background: alpha(theme.palette.background.paper, 0.8)
                      }}
                    >
                      <CircularProgress size={24} />
                      <Typography>Analyzing ingredients...</Typography>
                    </Paper>
                  </Box>
                </Fade>
              )}

              {error && (
                <Fade in timeout={600}>
                  <Box mt={3}>
                    <Alert
                      severity="error"
                      icon={<AlertCircle size={20} />}
                      sx={{
                        borderRadius: 3,
                        background: alpha(theme.palette.error.main, 0.1),
                        borderLeft: '4px solid',
                        borderColor: theme.palette.error.main
                      }}
                    >
                      <AlertTitle>Error</AlertTitle>
                      {error}
                    </Alert>
                  </Box>
                </Fade>
              )}

              {analysisResult && (
                <Fade in timeout={800}>
                  <Box mt={4}>
                    <ResultCard result={analysisResult} />
                  </Box>
                </Fade>
              )}
            </Container>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default OcrScanner;