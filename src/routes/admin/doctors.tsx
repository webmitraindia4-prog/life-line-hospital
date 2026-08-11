import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getDoctors,
  deleteDoctor,
} from "@/services/adminDoctorService";


export const Route = createFileRoute("/admin/doctors")({
  component: DoctorsPage,
});


function DoctorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(
    ((location as any).search?.search as string) || ""
  );

  const routeSearch = ((location as any).search?.search as string) || "";

  useEffect(() => {
    setSearch(routeSearch);
  }, [routeSearch]);

  async function handleDelete(id) {
    if (!confirm("Delete this doctor?")) return;

    try {
      const res = await deleteDoctor(id);

      if (res.success) {
        alert("Doctor deleted.");
        loadDoctors();
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);


  async function loadDoctors() {

    try {

      const res = await getDoctors();

      if(res.success){
        setDoctors(res.doctors);
      }

    } catch(error){

      console.error(
        "Doctors Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  const filteredDoctors = useMemo(() => {
    const keyword = search.toLowerCase();

    return doctors.filter((doctor) => {
      return (
        doctor.full_name?.toLowerCase().includes(keyword) ||
        doctor.email?.toLowerCase().includes(keyword) ||
        doctor.specialization?.toLowerCase().includes(keyword) ||
        doctor.status?.toLowerCase().includes(keyword)
      );
    });
  }, [doctors, search]);

  return (

    <DashboardLayout>

      <div className="space-y-6">


        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">
              Doctors
            </h1>

            <p className="text-gray-500">
              Manage hospital doctors
            </p>

          </div>


          <button
  onClick={() =>
    navigate({
      to: "/admin/doctor-add",
    })
  }
  className="
    flex items-center gap-2
    rounded-xl
    bg-blue-600
    px-5
    py-3
    text-white
    hover:bg-blue-700
  "
>

            <Plus size={20}/>

            Add Doctor

          </button>


        </div>



        {/* Search */}

        <div className="relative">

          <Search
            className="absolute left-4 top-3 text-gray-400"
            size={20}
          />


          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor..."
            className="
            w-full
            rounded-xl
            border
            bg-white
            py-3
            pl-12
            outline-none
            focus:border-blue-600
            "
          />


        </div>



        {/* Table */}


        <div className="
        overflow-hidden
        rounded-2xl
        bg-white
        shadow
        border
        ">


          {loading ? (

            <div className="p-10 text-center">
              Loading doctors...
            </div>

          ) : (


          <table className="w-full">


            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left align-middle">
                  Doctor
                </th>

                <th className="p-4 text-left align-middle">
                  Specialization
                </th>

                <th className="p-4 text-left align-middle">
                  Experience
                </th>

                <th className="p-4 text-left align-middle">
                  Status
                </th>

                <th className="p-4 text-left align-middle">
                  Actions
                </th>


              </tr>

            </thead>



            <tbody>


            {filteredDoctors.length > 0 ? filteredDoctors.map((doctor)=>(
              
              <tr
                key={doctor.id}
                className="border-t hover:bg-slate-50"
              >


                <td className="p-4 align-middle">


                  <div className="flex items-center gap-3">


                    <div className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-100
                    text-blue-600
                    ">

                      <UserRound/>

                    </div>


                    <div>

                      <p className="font-semibold">
                        {doctor.full_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {doctor.email}
                      </p>

                    </div>


                  </div>


                </td>


                <td className="p-4 align-middle">
                  {doctor.specialization}
                </td>


                <td className="p-4 align-middle">
                  {doctor.experience} Years
                </td>


                <td className="p-4 align-middle">

                  <span className="
                  rounded-full
                  bg-green-100
                  px-3
                  py-1
                  text-sm
                  text-green-700
                  ">
                    {doctor.status}
                  </span>

                </td>


                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        navigate({
                          to: "/admin/doctor-edit/$id",
                          params: { id: doctor.id },
                        })
                      }
                      className="rounded-lg p-2 hover:bg-blue-100"
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="rounded-lg p-2 hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={18}/>
                    </button>


                  </div>


                </td>


              </tr>

            )) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  No doctors found.
                </td>
              </tr>
            )}


            </tbody>


          </table>


          )}


        </div>


      </div>


    </DashboardLayout>

  );
}