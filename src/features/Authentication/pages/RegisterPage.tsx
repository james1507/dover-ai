import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@core/store/store';
import { registerUser } from '../store/authSlice';
import { RegisterPayload } from '@features/types/types';
import { useNavigate } from 'react-router-dom';
import { appService } from '@core/services/appService';

const RegisterPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterPayload>();

    const onSubmit = (data: RegisterPayload) => {
        dispatch(registerUser(data));
    };

    useEffect(() => {
        appService.appLog(`Current route: RegisterPage`);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 secondary-bg p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Đăng ký
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Tên</label>
                            <input
                                id="name"
                                type="text"
                                {...register("name", { required: "Tên là bắt buộc" })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập tên"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="age" className="sr-only">Tuổi</label>
                            <input
                                id="age"
                                type="number"
                                {...register("age", {
                                    required: "Tuổi là bắt buộc",
                                    min: { value: 18, message: "Tuổi phải lớn hơn 18" }
                                })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập tuổi"
                            />
                            {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email là bắt buộc",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Email không hợp lệ"
                                    }
                                })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập email"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Mật khẩu là bắt buộc",
                                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                                })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="address" className="sr-only">Địa chỉ</label>
                            <input
                                id="address"
                                type="text"
                                {...register("address", { required: "Địa chỉ là bắt buộc" })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập địa chỉ"
                            />
                            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone_number" className="sr-only">Số điện thoại</label>
                            <input
                                id="phone_number"
                                type="tel"
                                {...register("phone_number", { required: "Số điện thoại là bắt buộc" })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập số điện thoại"
                            />
                            {errors.phone_number && <p className="mt-1 text-sm text-red-500">{errors.phone_number.message}</p>}
                        </div>
                    </div>

                    {error && (
                        <div className="text-center space-y-1">
                            <p className="text-[#FF0000] font-regular">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed dark:disabled:bg-indigo-800"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            Đã có tài khoản?{' '}
                        </span>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:underline"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;