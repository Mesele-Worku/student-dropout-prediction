import { useState, useContext } from "react";
import axios from "axios";
import learning from "../../assets/learning-4.png";
import { AppContext } from "../../Context/AppContext";
export default function EngagementForm() {
  const { setResult } = useContext(AppContext);
  const [form, setForm] = useState({
    lecture_watch_pct: "",
    checklist_pct: "",
    attended_live_class: 0,
    attended_group_discussion: 0,
    qa_participation_pct: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsed = name.includes("attended") ? parseInt(value) : Number(value);
    setForm({ ...form, [name]: parsed });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://44.204.6.171:4000/api/predict", form);
    console.log(form);
    setResult(res.data);
  };

  return (
    <div className="mx-0 2xl:mx-30 p-2 flex flex-col md:items-stretch items-center md:flex-row justify-between gap-10 2xl:gap-12">
      <div className="w-full h-[550px] md:w-[60%]">
        <img src={learning} alt="" className="w-full h-full rounded-xl" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="px-10 py-7 shadow rounded-xl border border-gray-300 w-full h-full md:w-[40%]"
      >
        {Object.keys(form).map((key) => (
          <div key={key} className="mb-5">
            <label className="block text-[17px] mb-1">
              {key.replace(/_/g, " ")}
            </label>
            <input
              type="number"
              name={key}
              value={form[key]}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mx-auto">
          Predict Dropout
        </button>
      </form>
    </div>
  );
}
