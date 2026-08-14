function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
      });

      console.log("Response:", response.data);

      alert("Registration Successful");

    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div>
      <h2>Register Page</h2>
    </div>
  );
}

export default Register;