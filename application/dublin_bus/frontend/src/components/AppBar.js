// Code copy from MUI Responsive AppBar page

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import SvgIcon from "@mui/material/SvgIcon";

import LogIn from "./LogIn";
import { Modal } from "@mui/material";

const pages = ["Lines", "Weather", "Alerts", "Reports"]; // Setting the pages label
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const ResponsiveAppBar = () => {
	const [logIn, setLogIn] = React.useState(false);
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const [open, setOpen] = React.useState(false);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleOpenLogin = () => {
		setOpen(true);
	};

	const handleCloseLogin = () => {
		setOpen(false);
	};

	return (
		<div>
			<AppBar position="sticky" style={{ backgroundColor: "#00b273" }}>
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Box
							component="img"
							sx={{
								display: { xs: "none", md: "flex" },
								marginRight: "25px",
								height: "50px",
								width: "85px",
							}}
							alt="TFI Logo"
							src="../static/images/tfi-transport-for-ireland-vector-logo.png"
						/>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								marginBottom: "2px",
								display: { xs: "none", md: "flex" },
								// fontFamily: "monospace",
								// fontWeight: 700,
								// letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							Home
						</Typography>

						<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									// function that maps the drop down
									<MenuItem
										key={page}
										onClick={handleCloseNavMenu}
										to={`/${page}`}
										component={Link}
									>
										<Typography textAlign="center">{page}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
						<Typography
							// this is for the smaller navigation
							variant="h5"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							Home
						</Typography>
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
							{pages.map((page) => (
								<Button
									to={`/${page}`}
									component={Link}
									key={page}
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: "white", display: "block" }}
								>
									{page}
								</Button>
							))}
						</Box>
						{/*
          {logIn ? 
            <Box sx={{ flexGrow: 0 }}>  
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          : 
            <Box sx={{ flexGrow: 0 }}>  
                <Button
                  onClick={handleOpenLogin}
                  color='inherit'
                > Log In </Button> 
            </Box>
           }
          */}
					</Toolbar>
				</Container>
			</AppBar>
			<Modal
				open={open}
				onClose={handleCloseLogin}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<LogIn />
				</Box>
			</Modal>
		</div>
	);
};
export default ResponsiveAppBar;
