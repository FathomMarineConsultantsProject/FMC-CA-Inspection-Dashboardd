import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API = "https://fmc-client-admin-dashboard-backend.vercel.app/api/auth/register";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    addressRegional: "",
    addressISM: "",
    shipType: "",
    contactPerson: "",
    phone: "",
    email: "",
    username: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ✅ BASIC VALIDATION
    if (!form.companyName || !form.email || !form.password) {
      return toast.error("Please fill required fields");
    }

    try {
      const res = await axios.post(API, form);

      toast.success("Registered Successfully 🎉");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Company</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input name="companyName" placeholder="Company Name" onChange={handleChange} required />
        <input name="addressRegional" placeholder="Address (Regional)" onChange={handleChange} />
        <input name="addressISM" placeholder="Address (ISM)" onChange={handleChange} />
        <input name="shipType" placeholder="Type of Ship" onChange={handleChange} />
        <input name="contactPerson" placeholder="Contact Person" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <button className="col-span-2 bg-red-500 text-white p-2 rounded">
          Add Company
        </button>

      </form>
    </div>
  );
};

export default Register;