import React from 'react';

type CoopFarmLayoutProps = {
  children: React.ReactNode;
  sizeScreen: { width: number; height: number };
};

export const CoopFarmLayout: React.FC<CoopFarmLayoutProps> = ({ children, sizeScreen }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ height: '100vh', background: 'linear-gradient(to bottom, #121212, #3E513F)' }}>
      {/* AppBar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#030303',
          height: 70,
          justifyContent: 'center',
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={toggleDrawer(true)}>
            <MenuIcon sx={{ color: '#E8E3D4' }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              color: '#4CAF50',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            Coop Farm
          </Typography>
          <IconButton edge="end" onClick={() => navigate('/login')}>
            <AccountCircleIcon sx={{ color: '#E8E3D4' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: '#1e1e1e',
            height: '100%',
            color: '#D5C1A1',
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Box
            sx={{
              padding: 2,
              backgroundColor: '#2a2a2a',
              color: '#4CAF50',
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            Coop Farm Menu
          </Box>
          <List>
            {AppMenuItems.mainMenuItems().map((item, index) => (
              <ListItem button key={index} onClick={() => handleNavigation(item.route)}>
                <ListItemIcon sx={{ color: '#D5C1A1' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo principal */}
      <Box
        sx={{
          width: sizeScreen.width,
          minHeight: sizeScreen.height,
          padding: `${sizeScreen.height * 0.04}px 20px`,
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(232, 227, 212, 0.1)',
            borderRadius: 2,
            padding: 2,
            height: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
