import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useHistory } from "react-router";
import style from "styled-components";
import ChatPage from "./../page/ChatPage";

const CardJob = (props) => {
  const [list, setList] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const Body = style.div`
    width:40rem
  `;

  const buttonHandler = (action) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        if (action === "reject") {
          axios.patch(
            `http://localhost:3001/applies/${props._id}`,
            { status: "Rejected" },
            {
              headers: {
                token,
              },
            }
          );
        } else {
          axios.patch(
            `http://localhost:3001/applies/${props._id}`,
            { status: "Accepted" },
            {
              headers: {
                token,
              },
            }
          );
        }
      }
      Swal.fire("Action Success", "", "success");
      props.getLamaran("email", props.email);
    });
  };

  const deleteApply = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`http://localhost:3001/applies/${props._id}`, {
            headers: {
              token,
            },
          })
          .then((res) => {
            Swal.fire("Saved!", "", "success");
            props.getLamaran("email", props.email);
          });
      }
    });
  };

  const goToChat = () => {
    // console.log(props.idPelamar._id)
    const state = {
      room: `${props.vacancyId._id}${props.idPelamar._id}`,
    };
    history.push("/profile/chat", state);
  };

  return (
    <div className="flex justify-center h-auto  ">
      <Body className="bg-gray-100 py-3 flex justify-between filter drop-shadow-lg pl-5 pr-5">
        <div>
          <span className="font-bold">{props.companyName}</span>
        </div>
        {/* <div>
            <button onClick={() => setList(true)} className="bg-blue-500 text-white rounded-md w-32 ">klik more info</button>
        </div> */}
        <div className="flex w3/4 justify-around">
          <div className="flex flex-col">
            {props.userRole === "hrd" ? (
              <a href={props.idPelamar.cv} className="">{props.idPelamar.name}</a>
            ) : null}
            <span className="font-bold">{props.vacancyId.role}</span>
            <h1 className="bg-yellow-500 w-32 text-white text-center rounded-sm">{props.status}</h1>
          </div>
          <div className=" flex flex-col h-20 items-center gap-1 ">
            {props.userRole === "hrd" && props.status === "Pending" ? (
              <button
                onClick={() => buttonHandler("accept")}
                className="bg-blue-500 text-white h-8 px-1 rounded-sm"
              >
                Approve
              </button>
            ) : null}
            {props.userRole === "hrd" && props.status === "Pending" ? (
              <button
                onClick={() => buttonHandler("reject")}
                className="bg-blue-500 text-white h-8 px-1 rounded-sm"
              >
                Reject
              </button>
            ) : null}
            {props.status === "Rejected" || props.status === "Accepted" ? (
              <button
                onClick={() => deleteApply()}
                className="bg-blue-500 text-white h-8 px-1 rounded-sm"
              >
                Delete
              </button>
            ) : null}
            {props.status === "Accepted" && (
              <button onClick={goToChat}  className="bg-blue-500 text-white h-8 px-1 rounded-sm">
                Chat
              </button>
            )}
          </div>
        </div>
      </Body>
    </div>
  );
};

export default CardJob;
