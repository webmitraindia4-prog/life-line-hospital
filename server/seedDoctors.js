require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

const DEFAULT_DOCTOR_PASSWORD = "Doctor@2026";
const doctors = [
  {
    full_name: "Dr. Anil Kumar",
    specialization: "Orthopaedics",
    qualification: "MBBS, MS",
    experience: 8,
    phone: "9600000001",
    email: "anil.kumar@require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./config/db");

const DEFAULT_DOCTOR_PASSWORD = "Doctor@2026";

const doctors = [
  {
    full_name: "Dr. M.A Huq Nadeeem",
    specialization: "Ophthalmology",
    qualification: "MBBS, DOMS",
    experience: 15,
    phone: "9600000003",
    email: "mahuq.nadeeem@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Vijay Rathod",
    specialization: "Neuro Surgeon",
    qualification: "MBBS, M.Ch",
    experience: 14,
    phone: "9600000004",
    email: "vijay.rathod@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Arif Mulla",
    specialization: "Retina Specialist",
    qualification: "MBBS, DNB",
    experience: 10,
    phone: "9600000005",
    email: "arif.mulla@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Khayyum Pasha",
    specialization: "Physician, Diabetologist & Cardiologist",
    qualification: "MBBS, MD",
    experience: 11,
    phone: "9600000006",
    email: "khayyum.pasha@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Anil Garildinni",
    specialization: "Gastroenterology",
    qualification: "MBBS, MD",
    experience: 9,
    phone: "9600000007",
    email: "anil.garildinni@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Hari Prasad",
    specialization: "Physician, Diabetologist & Cardiologist",
    qualification: "MBBS, DCH",
    experience: 13,
    phone: "9600000008",
    email: "hari.prasad@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Dikka Roa.M",
    specialization: "Pediatrician",
    qualification: "MBBS, DM",
    experience: 17,
    phone: "9600000009",
    email: "dikka.roa@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. C.H Ramesh",
    specialization: "Oncologist",
    qualification: "MBBS, MS",
    experience: 18,
    phone: "9600000010",
    email: "ch.ramesh@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Shahdab Ahmed",
    specialization: "Orthopaedician",
    qualification: "MBBS, MS",
    experience: 17,
    phone: "9600000011",
    email: "shahdab.ahmed@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Ayesha Zeba",
    specialization: "Pediatrician",
    qualification: "MBBS, MD",
    experience: 8,
    phone: "9600000012",
    email: "ayesha.zeba@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Bande Nawaz",
    specialization: "Medico Legal Consultant",
    qualification: "MBBS, MD",
    experience: 15,
    phone: "9600000013",
    email: "bande.nawaz@lifelinehospital.in",
    profile_image: null,
  },

  {
    full_name: "Dr. Sukh Sagar",
    specialization: "Orthopaedian & Joint Replacement",
    qualification: "MBBS, MS",
    experience: 7,
    phone: "9600000014",
    email: "sukh.sagar@lifelinehospital.in",
    profile_image: null,
  },
];

async function seedDoctors() {
  try {
    const hashedPassword = await bcrypt.hash(
      DEFAULT_DOCTOR_PASSWORD,
      10
    );

    for (const doctor of doctors) {
      const [existingDoctors] = await db.query(
        "SELECT id FROM doctors WHERE email = ? OR phone = ?",
        [doctor.email, doctor.phone]
      );

      if (existingDoctors.length > 0) {
        const doctorId = existingDoctors[0].id;

        await db.query(
          `UPDATE doctors
           SET full_name = ?,
               specialization = ?,
               qualification = ?,
               experience = ?,
               phone = ?,
               email = ?,
               password = ?,
               profile_image = ?,
               status = 'Active'
           WHERE id = ?`,
          [
            doctor.full_name,
            doctor.specialization,
            doctor.qualification,
            doctor.experience,
            doctor.phone,
            doctor.email,
            hashedPassword,
            doctor.profile_image,
            doctorId,
          ]
        );

        console.log(
          `Updated doctor record: ${doctor.full_name}`
        );
      } else {
        await db.query(
          `INSERT INTO doctors
           (
             full_name,
             specialization,
             qualification,
             experience,
             phone,
             email,
             password,
             profile_image,
             status
           )
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
          [
            doctor.full_name,
            doctor.specialization,
            doctor.qualification,
            doctor.experience,
            doctor.phone,
            doctor.email,
            hashedPassword,
            doctor.profile_image,
          ]
        );

        console.log(
          `Inserted doctor record: ${doctor.full_name}`
        );
      }
    }

    console.log("");
    console.log("=================================");
    console.log("Doctor seed completed successfully");
    console.log("=================================");
    console.log(`Default password: ${DEFAULT_DOCTOR_PASSWORD}`);

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed doctors:",
      error.message || error
    );

    process.exit(1);
  }
}

seedDoctors();.in",
    profile_image: null,
  },
  {
    full_name: "Dr. Rajesh Kumar",
    specialization: "Cardiology",
    qualification: "MBBS, MD",
    experience: 12,
    phone: "9600000002",
    email: "rajesh.kumar@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. M.A Huq Nadeeem",
    specialization: "Ophthalmology",
    qualification: "MBBS, DOMS",
    experience: 15,
    phone: "9600000003",
    email: "mahuq.nadeeem@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. Vijay Rathod",
    specialization: "Neuro Surgery",
    qualification: "MBBS, M.Ch",
    experience: 14,
    phone: "9600000004",
    email: "vijay.rathod@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. Arif Mulla",
    specialization: "Retina Specialist",
    qualification: "MBBS, DNB",
    experience: 10,
    phone: "9600000005",
    email: "arif.mulla@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. Khayyum Pasha",
    specialization: "Physician, Diabetologist & Cardiologist",
    qualification: "MBBS, MD",
    experience: 11,
    phone: "9600000006",
    email: "khayyum.pasha@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. Anil Garildinni",
    specialization: "Gastroenterology",
    qualification: "MBBS, MD",
    experience: 9,
    phone: "9600000007",
    email: "anil.garildinni@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. Hari Prasad",
    specialization: "Pediatrician",
    qualification: "MBBS, DCH",
    experience: 13,
    phone: "9600000008",
    email: "hari.prasad@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. Dikka Roa.M",
    specialization: "Oncology",
    qualification: "MBBS, DM",
    experience: 16,
    phone: "9600000009",
    email: "dikka.roa@lifelinehospital.in",
    profile_image: null,
  },
  {
    full_name: "Dr. C.H Ramesh",
    specialization: "Orthopaedic & Joint Replacement",
    qualification: "MBBS, MS",
    experience: 18,
    phone: "9600000010",
    email: "ch.ramesh@lifelinehospital.in",
    profile_image: null,
  },
];

async function seedDoctors() {
  try {
    const hashedPassword = await bcrypt.hash(DEFAULT_DOCTOR_PASSWORD, 10);

    for (const doctor of doctors) {
      const [existingDoctors] = await db.query(
        "SELECT id FROM doctors WHERE email = ? OR phone = ?",
        [doctor.email, doctor.phone]
      );

      if (existingDoctors.length > 0) {
        const doctorId = existingDoctors[0].id;
        await db.query(
          `UPDATE doctors
           SET full_name = ?, specialization = ?, qualification = ?, experience = ?, phone = ?, email = ?, password = ?, profile_image = ?, status = 'Active'
           WHERE id = ?`,
          [
            doctor.full_name,
            doctor.specialization,
            doctor.qualification,
            doctor.experience,
            doctor.phone,
            doctor.email,
            hashedPassword,
            doctor.profile_image,
            doctorId,
          ]
        );
        console.log(`Updated doctor record: ${doctor.full_name}`);
      } else {
        await db.query(
          `INSERT INTO doctors (full_name, specialization, qualification, experience, phone, email, password, profile_image, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
          [
            doctor.full_name,
            doctor.specialization,
            doctor.qualification,
            doctor.experience,
            doctor.phone,
            doctor.email,
            hashedPassword,
            doctor.profile_image,
          ]
        );
        console.log(`Inserted doctor record: ${doctor.full_name}`);
      }
    }

    console.log("Doctor seed completed.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed doctors:", error.message || error);
    process.exit(1);
  }
}

seedDoctors();