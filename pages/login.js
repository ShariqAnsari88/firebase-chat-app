const Login = () => {
    return (
        <div className="h-[100vh] flex justify-center items-center">
            <form className="flex flex-col gap-3 w-[350px] p-5 bg-gray-600">
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;
