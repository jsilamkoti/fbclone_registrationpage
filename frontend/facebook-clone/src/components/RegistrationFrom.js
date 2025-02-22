// components/RegistrationForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Default if not set
            const response = await axios.post(`${baseURL}/api/register`, { // Corrected base URL
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
                setErrorMessage('Registration failed.'); // Improve this with details from response if available
                setRegistrationSuccess(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.response?.data?.detail || 'An unexpected error occurred.'); //Backend error detail
            setRegistrationSuccess(false);
        }
    };

    return (
        <div className="registration-form">
            <h2>Create a Facebook Account</h2>
            {registrationSuccess && (
                <div className="success-message">Registration successful!</div>
            )}
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        {...register("firstName", { required: "First name is required" })}
                    />
                    {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        {...register("lastName", { required: "Last name is required" })}
                    />
                    {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format",
                            },
                        })}
                    />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                    />
                    {errors.password && <p className="error-text">{errors.password.message}</p>}
                </div>

                <div className="form-group">
                    <label>Birthday:</label>
                    <div className="birthday-selects">
                        <select {...register("birthMonth", { required: "Birthday is required" })}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select {...register("birthDay", { required: "Birthday is required" })}>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select {...register("birthYear", { required: "Birthday is required" })}>
                            {Array.from({ length: 120 }, (_, i) => (
                                <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </select>
                    </div>
                    {(errors.birthMonth || errors.birthDay || errors.birthYear) && (
                        <p className="error-text">Birthday is required</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Gender:</label>
                    <div className="gender-radios">
                        <label>
                            <input type="radio" value="female" {...register("gender", { required: "Gender is required" })} />
                            Female
                        </label>
                        <label>
                            <input type="radio" value="male" {...register("gender", { required: "Gender is required" })} />
                            Male
                        </label>
                        <label>
                            <input type="radio" value="other" {...register("gender", { required: "Gender is required" })} />
                            Other
                        </label>
                    </div>
                    {errors.gender && <p className="error-text">{errors.gender.message}</p>}
                </div>

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default RegistrationForm;