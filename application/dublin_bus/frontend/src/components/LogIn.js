import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { Grid } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRef } from "react";

// Feature to allow users to login, de-scoped

function LogIn() {
	const userNameRef = useRef();
	const passWordRef = useRef();

	const handleLogIn = (event) => {
		event.preventDefault(); // prevent deafult

		console.log(userNameRef.current.value);
		console.log(passWordRef.current.value);
	};

	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<Card>
			<Typography
				component="h6"
				variant="h6"
				style={{
					textAlign: "center",
					margin: "10px",
				}}
			>
				Log in
			</Typography>

			<FormControl fullWidth>
				<TextField
					fullWidth
					required
					style={{ margin: "10px 0px " }}
					id="username"
					label="Username"
					margin="normal"
					inputRef={userNameRef}
				/>

				<FormControl variant="outlined">
					<InputLabel htmlFor="outlined-adornment-password">
						Password
					</InputLabel>
					<OutlinedInput
						inputRef={passWordRef}
						type={showPassword ? "text" : "password"}
						fullWidth
						required
						style={{ margin: "10px 0px " }}
						id="outlined-adornment-password"
						label="Password"
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					></OutlinedInput>
				</FormControl>

				<Grid container spacing={2}>
					<Grid item width={"50%"}>
						<Button
							fullWidth
							style={{ margin: "10px 0px " }}
							variant="contained"
						>
							Sign up
						</Button>
					</Grid>
					<Grid item width={"50%"}>
						<Button
							type="submit"
							color="secondary"
							fullWidth
							style={{ margin: "10px 0px " }}
							variant="contained"
							onClick={handleLogIn}
						>
							Log In
						</Button>
					</Grid>
				</Grid>
			</FormControl>
		</Card>
	);
}
export default LogIn;
