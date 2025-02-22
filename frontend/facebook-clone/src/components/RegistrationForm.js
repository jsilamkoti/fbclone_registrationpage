// src/components/RegistrationForm.js
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    // Use useEffect to set initial dark mode state from localStorage
    useEffect(() => {
        const storedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(storedDarkMode);
    }, []);

    // Save dark mode state to localStorage on toggle
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const onSubmit = async (data) => {
        try {
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const response = await axios.post(`${baseURL}/api/register`, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                birthDay: parseInt(data.birthDay),
                birthMonth: parseInt(data.birthMonth),
                birthYear: parseInt(data.birthYear),
                gender: data.gender,
            });

            if (response.status === 200) {
                setRegistrationSuccess(true);
                setErrorMessage('');
            } else {
                setErrorMessage('Registration failed.');
                setRegistrationSuccess(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.response?.data?.detail || 'An unexpected error occurred.');
            setRegistrationSuccess(false);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const formStyle = {
        width: 'min(600px, 90%)', // Responsive width
        maxWidth: '600px',
        padding: '20px',
        margin: '20px auto', // Centered with margin
        fontFamily: 'Arial, sans-serif',
        backgroundColor: darkMode ? '#333' : '#fff',
        border: '1px solid #dddfe2',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        color: darkMode ? '#eee' : '#333', // Adjust text color for dark mode
    };

    const titleStyle = {
        fontSize: '36px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#1877f2',
        textAlign: 'center',
    };

    const subtitleStyle = {
        fontSize: '19px',
        marginBottom: '20px',
        color: darkMode ? '#aaa' : '#606770',
        textAlign: 'center',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #dddfe2',
        borderRadius: '5px',
        fontSize: '16px',
        backgroundColor: darkMode ? '#444' : '#f7f7f7',
        color: darkMode ? '#eee' : '#333',
    };

    const birthdayStyle = {
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
    };

    const selectStyle = {
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #dddfe2',
        borderRadius: '5px',
        flex: '1',
        backgroundColor: darkMode ? '#444' : '#f7f7f7',
        color: darkMode ? '#eee' : '#333',
    };

    const genderStyle = {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    };

    const radioLabelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '16px',
        color: darkMode ? '#eee' : '#1c1e21',
    };

    const submitButtonStyle = {
        background: '#42b72a',
        color: 'white',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };

    const horizontalRuleStyle = {
        borderBottom: '1px solid #dddfe2',
        marginBottom: '20px',
        marginTop: '20px',
    };

    const createPageStyle = {
        fontSize: '14px',
        color: darkMode ? '#bbb' : '#1c1e21',
        marginTop: '20px',
        textAlign: 'center',
    };

    const darkModeToggleStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px',
        backgroundColor: darkMode ? '#eee' : '#333',
        color: darkMode ? '#333' : '#eee',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const birthdayLabelStyle = {
        fontSize: '14px',
        color: darkMode ? '#ccc' : '#65676b',
        marginBottom: '5px',
    };
       const selectOptionStyle = {
        color: darkMode ? '#eee' : '#333', // Option text color
    };

    return (
        <div style={{ backgroundColor: darkMode ? '#222' : '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={formStyle}>
                <div style={darkModeToggleStyle} onClick={toggleDarkMode}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </div>
                <h1 style={titleStyle}>Create a Facebook Account</h1>
                <p style={subtitleStyle}>It's quick and easy.</p>
                <div style={horizontalRuleStyle} />

                {registrationSuccess && (
                    <div style={{ color: 'green', marginBottom: '10px' }}>Registration successful!</div>
                )}
                {errorMessage && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="First Name"
                        style={inputStyle}
                        {...register("firstName", { required: "First name is required" })}
                    />
                    {errors.firstName && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.firstName.message}</p>}

                    <input
                        type="text"
                        placeholder="Last Name"
                        style={inputStyle}
                        {...register("lastName", { required: "Last name is required" })}
                    />
                    {errors.lastName && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.lastName.message}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        style={inputStyle}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format",
                            },
                        })}
                    />
                    {errors.email && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.email.message}</p>}

                    <input
                        type="password"
                        placeholder="New password"
                        style={inputStyle}
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                    />
                    {errors.password && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.password.message}</p>}

                    <p style={birthdayLabelStyle}>Birthday</p>
                    <div style={birthdayStyle}>
                        <select style={selectStyle} {...register("birthMonth", { required: "Birthday is required" })}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1} style={selectOptionStyle}>{i + 1}</option>
                            ))}
                        </select>
                        <select style={selectStyle} {...register("birthDay", { required: "Birthday is required" })}>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i + 1} value={i + 1} style={selectOptionStyle}>{i + 1}</option>
                            ))}
                        </select>
                        <select style={selectStyle} {...register("birthYear", { required: "Birthday is required" })}>
                            {Array.from({ length: 120 }, (_, i) => (
                                <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i} style={selectOptionStyle}>
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </select>
                    </div>
                    {(errors.birthMonth || errors.birthDay || errors.birthYear) && (
                        <p style={{ color: 'red', fontSize: '0.8em' }}>Birthday is required</p>
                    )}

                    <p style={birthdayLabelStyle}>Gender</p>
                    <div style={genderStyle}>
                        <label style={radioLabelStyle}>
                            <input type="radio" value="female" {...register("gender", { required: "Gender is required" })} />
                            Female
                        </label>
                        <label style={radioLabelStyle}>
                            <input type="radio" value="male" {...register("gender", { required: "Gender is required" })} />
                            Male
                        </label>
                        <label style={radioLabelStyle}>
                            <input type="radio" value="other" {...register("gender", { required: "Gender is required" })} />
                            Other
                        </label>
                    </div>
                    {errors.gender && <p style={{ color: 'red', fontSize: '0.8em' }}>{errors.gender.message}</p>}

                    <button type="submit" style={submitButtonStyle}>Sign Up</button>
                </form>

                <div style={horizontalRuleStyle} />
                <div style={createPageStyle}>
                    <a href="#" style={{ fontWeight: 'bold', color: '#1877f2', textDecoration: 'none' }}>Create a Page</a> for a celebrity, brand or business.
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;