import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@core/store/store';
import { loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth) as {
        loading: boolean;
        error: string | null
    };
    const { register, handleSubmit } = useForm<{ email: string; password: string }>();
    const navigate = useNavigate();

    const onSubmit = (data: { email: string; password: string }) => {
        dispatch(loginUser(data));
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 secondary-bg p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Đăng nhập
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", { required: true })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password", { required: true })}
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nhập mật khẩu"
                            />
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
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            Chưa có tài khoản?{' '}
                        </span>
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:underline"
                        >
                            Đăng ký ngay
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;