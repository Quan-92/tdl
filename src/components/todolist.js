import React, { useEffect, useState, useRef } from "react";
import "../styles/components/_todolist.scss";
import { IoCheckmarkDone } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const TodoList = () => {
  const storageJob = JSON.parse(localStorage.getItem("listJob")) || [];
  const [newJob, setJob] = useState("");
  const [listJob, setListJob] = useState(storageJob ?? []);
  const [editJob, setEditJob] = useState([]);
  const [editId, setEditId] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("listJob", JSON.stringify(listJob));
  }, [listJob]);

  const updateJob = (title, id, completed) => {
    const Job = listJob.map((newJob) =>
      newJob.id === id ? { title, id, completed } : newJob
    );
    setListJob(Job);
    setEditJob("");
  };

  useEffect(() => {
    if (editJob) {
      setJob(editJob.title);
    } else {
      setJob("");
    }
  }, [setJob, editJob]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!editJob) {
      setListJob([
        ...listJob,
        { id: uuidv4(), title: newJob, completed: false },
      ]);
      setJob("");
    } else {
      updateJob(newJob, editJob.id, editJob.completed);
    }
  };

  const AddJob = () => {
    if (newJob == null || newJob === "") return;
    const jobadd = {
      id: uuidv4(),
      title: newJob,
      completed: false,
    };
    const newJobAdd = [...listJob, jobadd];
    setListJob((prevState) => (prevState = newJobAdd));

    const jsonJob = JSON.stringify(newJobAdd);
    localStorage.setItem("listJob", jsonJob);

    setJob("");

    if (!editJob) {
      const newJobArr = [
        ...newJob,
        {
          id: uuidv4(),
          desc: listJob,
          completed: false,
          dateCompleted: null
        }
      ];
      setJob((prevState) => (prevState = newJobArr));
      setListJob("");
      inputRef.current.focus();
    } else {
      const newArr = newJob.slice();
      const indexArr = newArr.map((arr) => arr.id);
      const index = indexArr.indexOf(editId);
      newArr.slice(index, 1, {
        id: editId,
        desc: listJob,
        completed: false,
        dateCompleted: null,
      });
      setJob((prevState) => (prevState = newArr));
      setListJob("");
      setEditId("");
      setEditJob(false);
      inputRef.current.focus();
    }
  }

  const handleCompleted = (newJob) => {
    setListJob(
      listJob.map((item) => {
        if (item.id === newJob.id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
  };

  const handleEdit = (id) => {
    const findJob = listJob.find((newJob) => newJob.id === id);
    setEditJob(findJob);
    setEditId();
    inputRef.current.focus();
  };

  const handleDelete = (id) => {
    setListJob((prevState) => prevState.filter((newJob) => newJob.id !== id));
  };

  return (
    <>
      <div className="main-div">
        <div className="child-div">
          <figure>
            <img
              src="https://sathyanand.files.wordpress.com/2015/09/to-do-list1.jpg"
              alt=""
            />
          </figure>
          TODO LIST
        </div>
        <div className="form-div">
          <div className="form-child" onSubmit={onFormSubmit}>
            <input
              id="add-task"
              type="text"
              value={newJob}
              required
              placeholder="Add a new job"
              onChange={(e) => setJob(e.target.value)}
            />

            <button id="click-add" onClick={AddJob}>
              ADD
            </button>
          </div>

          <div className="list-add">
            {listJob !== [] ? (
              <ul>
                {listJob.map((newJob, value) => {
                  return (
                    <>
                      <li>
                        {"☛ "} 
                        <button className="completed click-job" onClick={() => handleCompleted(newJob)}>
                        <IoCheckmarkDone id="icon_completed"/>
                        </button>
                        {newJob.title}
                        <button className="delete click-job" onClick={() => handleDelete(newJob.id)}>
                          <RiDeleteBin5Line id="icon_delete"/>
                        </button>
                        <button className="edit click-job" onClick={() => handleEdit(newJob.id)}>
                          <MdOutlineEdit id="icon_edit"/>
                        </button>
                      </li>
                    </>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* <div className="com-del">
            <button id="com-all" onClick={() => handleCompleted(newJob)}>Complete All</button>
            <button id="del-all" onClick={() => handleDelete(listJob.title)}>Delete all</button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default TodoList;
