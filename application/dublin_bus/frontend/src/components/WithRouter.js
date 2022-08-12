import React, { Component } from "react";
import { useNavigate } from "react-router-dom";

// Source youtube.com
// Component to allow routing using latest version of react router dom
// Part of favourites feature, de-scoped
export const withRouter = (Component) => {
	const Wrapper = (props) => {
		const navigate = useNavigate();

		return <Component navigate={navigate} {...props} />;
	};

	return Wrapper;
};
