import { useState } from 'react'
import { Button, Typography, Alert, Box, Backdrop, CircularProgress } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { translations } from '../../i18n/translations'

export default function LoginComponent() {
  const [error] = useState('')
  const { isSigningIn, enterAsGuest } = useAuth()
  const { language } = useLanguage()
  const t = translations[language].login

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // Centrado en todos los dispositivos
      height: '100%',
      backgroundColor: '#FFD700', // Amarillo dorado
      borderRadius: '20px !important', // Bordes redondeados
      mx: 0, // Sin márgenes horizontales
      my: 0, // Sin márgenes verticales
      width: '100%',
      minHeight: '100vh',
      position: 'relative', // Para que el Backdrop se posicione correctamente
      // En desktop, mover un poco hacia arriba del centro
      '@media (min-width: 768px)': {
        alignItems: 'flex-start',
        paddingTop: '25vh' // 25% del viewport height desde arriba
      },
      // Solo en mobile, ocupar toda la pantalla
      '@media (max-width: 767px)': {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        borderRadius: '0px !important',
        zIndex: 9999
      }
    }}>
      <Box sx={{
        bgcolor: 'white',
        transform: { xs: 'translateY(-5vh)', md: 'translateY(-3vh)' }, // Subir visualmente la caja blanca
        px: 3,
        pb: 3,
        pt: 2,
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        maxWidth: '330px',
        width: '100%'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 0.5,
          height: '144px',
          overflow: 'hidden'
        }}>
          <Box
            sx={{
              display: 'block'
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}entrenate-emoji.png`}
              alt="Entrenate"
              style={{
                height: '240px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                marginTop: '-48px'
              }}
            />
          </Box>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1.5, color: '#333', letterSpacing: '-0.5px', fontSize: '2.3rem' }}>
          Entrenate
        </Typography>

        {/* Botón principal: Ingresa en Modo Invitado */}
        <Button
          onClick={enterAsGuest}
          variant="contained"
          sx={{
            width: '85%',
            mx: 'auto',
            display: 'flex',
            mt: 1,
            py: 1.4,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            border: '1.5px solid #e0e0e0',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#cccccc',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          {language === 'es' ? 'Ingresa en Modo Invitado' : 'Continue as Guest'}
        </Button>

        <Box sx={{ mt: 1.5, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              fontWeight: 500
            }}
          >
            {language === 'es'
              ? 'App disponible exclusivamente en Modo Invitado'
              : 'App available exclusively in Guest Mode'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Loader completo para login */}
      <Backdrop
        sx={{
          color: 'white',
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: 'rgba(255, 215, 0, 0.95)', // Amarillo dorado con más opacidad
          backdropFilter: 'blur(2px)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px !important',
          transition: 'all 0.2s ease-in-out',
          '@media (max-width: 767px)': {
            borderRadius: '0px !important'
          }
        }}
        open={isSigningIn}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            marginTop: '-120px' // Mover más arriba
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: 'white',
              backgroundColor: 'transparent',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
            {t.authenticating}
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  )
}


