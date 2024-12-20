import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiPath from "../../../isProduction";

function DoctorAppointment() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(null);

  async function checkLocalUser() {
    const user = await JSON.parse(localStorage.getItem("profile"));

    if (user) {
      const { id, username } = await user;
      const data = await axios.post(`${apiPath()}/auth-doctor`, {
        id,
        username,
      });

      if (!data.data.status) {
        localStorage.clear();
        navigate("/login");
      }

      const data2 = await axios.post(`${apiPath()}/get-appointments-doctor`, {
        doctorId: id,
      });

      setAppointments(data2.data.data.reverse());
    }
  }

  useEffect(() => {
    checkLocalUser();
  }, []);

  async function updateStatus(appId, status) {
    const data = await axios.post(`${apiPath()}/update-status`, {
      id: appId,
      status,
    });

    if (data.data.status) {
      alert("Updated...!");
    } else {
      alert("Something Went Wrong!");
    }
  }

  return (
    <>
      <h1>
        <i class="fa-regular fa-calendar-check"></i> Appointments :
      </h1>

      <section className="view-appointment">
        <br />
        <h2>Scheduled Appointments :</h2>
        <hr />
        {appointments ? (
          <ul>
            {appointments.map((app, key) => {
              return (
                <li key={key}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3952/3952988.png" />

                  <p>
                    <b> Patient : </b> {app?.patientName}
                  </p>
                  <p>
                    <b> Time : </b> {app?.time}
                  </p>
                  <p>
                    <b> Date : </b> {app?.date}
                  </p>
                  <p>
                    <b> Reason : </b> {app?.reason}
                  </p>
                  <br />
                  <p>
                    <b> Status : </b>

                    <select
                      className={
                        app?.status == "pending"
                          ? "pending"
                          : app?.status == "accepted"
                          ? "accepted"
                          : "rejected"
                      }
                      onChange={(e) => {
                        updateStatus(app._id, e.target.value);
                        checkLocalUser();
                      }}
                    >
                      <option
                        className="orange"
                        selected={app?.status == "pending"}
                        value="pending"
                      >
                        Pending <i class="fa-regular fa-clock"></i>
                      </option>
                      <option
                        className="green"
                        selected={app?.status == "accepted"}
                        value="accepted"
                      >
                        Accepted <i class="fa-regular fa-circle-check"></i>
                      </option>
                      <option
                        className="red"
                        selected={app?.status == "rejected"}
                        value="rejected"
                      >
                        Rejected <i class="fa-solid fa-ban"></i>
                      </option>
                    </select>
                  </p>
                  <br />
                </li>
              );
            })}
          </ul>
        ) : (
          <h3>Loading Appointments History...</h3>
        )}
      </section>
    </>
  );
}

export default DoctorAppointment;
