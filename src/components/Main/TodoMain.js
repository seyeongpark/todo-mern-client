import {useState, useEffect} from 'react';
import './TodoMain.css';

const API_BASE = "https://sp-todo-mern.herokuapp.com/api";

function TodoMain() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [userId, setUserId] = useState("");
  const [userFName, setUserFName] = useState("");

  useEffect(() =>{
    const userName = localStorage.getItem("loggedFName");
    const crtuserId = localStorage.getItem("loggedUserId");
    setUserFName(userName);
    setUserId(crtuserId);
    GetTodos(crtuserId);
    console.log('Logged in user INFORMATION--');
    console.log("Name: ", userName);
  }, [])

  

  const GetTodos = async userId => {
    await fetch(API_BASE + "/todos/"+ userId)
    .then(res => res.json())
    .then(data => setTodos(data))
    .catch(err => console.error("Error: " + err))

    console.log("fetch todos")
  }

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/api/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            authorId: userId,
            text: newTodo
        })
    }).then(res => res.json())
    
      setTodos([...todos, data]);
      setPopupActive(false);
      setNewTodo("");
  }

  const completeTodo = async id => {
      const data = await fetch(API_BASE + "/api/todo/complete/"+id)
        .then(res => res.json());
        
        setTodos(todos => todos.map(todo => {
          if (todo._id === data._id) {
            todo.complete = data.complete;
          }
          return todo;
        }));
  }

  const deleteTodo = async id => {
    const data = await fetch(API_BASE + "/api/todo/delete/"+id, {method: "DELETE"})
    .then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id != data._id));
  }

  const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("loggedFName");
		localStorage.removeItem("loggedUserId");
		window.location.reload();
	};

  return(
    <div className="App">
      <h1> Hello, { userFName }</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.map(todo =>(
          <div className={"todo " + (todo.complete ? "is-complete" : "")} key={todo._id} onClick={()=> completeTodo(todo._id)}>
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={()=> deleteTodo(todo._id)}>x</div>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Task</h3>
            { newTodo }
            <input 
                type="text" 
                className="add-todo-input" 
                onChange={ e => setNewTodo(e.target.value)} 
                value={newTodo} />
              <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : ''}

      <button className='btn-logout' onClick={handleLogout}>
					Logout
			</button>
    </div>
  );
}

export default TodoMain;
